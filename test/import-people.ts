import {runTest} from "./bootstrap";
import fs from "fs/promises";
import {parseStringPromise} from "xml2js";
import {getDb} from "../lib/mysql/db-config";
import {PromiseOneByOne} from "../lib/promise-one-by-one";

runTest(async () => {
  let xml = await fs.readFile("../export/export.xml", "utf8");
  let tree = await parseStringPromise(xml, {
    trim: true,
    explicitArray: false,
    mergeAttrs: true,
  });
  let personList = tree.agelongtree.Pers.r;
  console.log("personList", personList.length);
  const allColumns = personList.reduce((a, x) => {
    return [...a, ...Object.keys(x)];
  }, []);
  // console.log(allColumns);
  let colTypes = allColumns.reduce((a, col) => {
    let row1 = personList.find((x) => x[col]);
    let val1 = row1[col];
    let xType = typeof val1;
    if (!isNaN(Number(val1)) && String(Number(val1)) === val1) {
      xType = "number";
    }
    if (xType === "string" && val1.match(/\d{2}\.\d{2}\.\d{4}/)) {
      // @ts-ignore
      xType = "date";
    }
    return { ...a, [col]: xType };
  }, {});
  console.table(colTypes);
  Object.entries(colTypes).map(([key, val]) => {
    const typeMap = {
      string: "varchar(100)",
      object: "json",
      number: "int",
      date: "date",
    };
    // @ts-ignore
    let sqlType = typeMap[val];
    console.log(key, sqlType);
  });

  const tPerson = (await getDb()).getTable("people");
  await PromiseOneByOne(
    personList.map(async (person, index) => {
      console.log(index, "/", personList.length);
      let insert: any = Object.entries(colTypes).map(([col, type]) => {
        if (type === "object") {
          return [col, JSON.stringify(person[col])];
        }
        if (type === "date" && person[col]) {
          return [col, person[col].split(".").reverse().join("-")];
        }
        return [col, person[col]];
      });
      insert = Object.fromEntries(insert);
      // @ts-ignore
      insert.alive = insert?.alive === "T";
      // @ts-ignore
      insert.sex = insert?.sex === "T";
      // console.log(insert);
      await tPerson.insertUpdate(insert);
    })
  );
});

