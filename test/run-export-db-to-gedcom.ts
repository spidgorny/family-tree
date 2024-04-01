import { runTest } from "./bootstrap";
import { getDb } from "../lib/mysql/db-config";
import astToGedcom from "generate-gedcom";
import fs from "fs/promises";
import { func } from "prop-types";
export interface PersonRow {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alive: boolean;
  de: Date;
  di: Date;
  fn: string;
  fullname: string;
  sex: string;
  spouse: {
    id: string;
    sex: "M" | "F";
    marriage: string;
    child: [{ id: string; sex: "M" | "F" }];
  };
  msn: string;
  mn: string;
  father: string;
  mother: string;
  occu: string;
  age: number;
  bfdate: Date;
  pl_full: string;
  pl_short: string;
  doc: string;
  comment: string;
  sn: string;
  dfdate: string;
  lifespan: string;
  dreason: string;
  bplace: string;
  bfplace: string;
}

void runTest(async () => {
  const tPerson = (await getDb()).getTable("people");
  let people = (await tPerson.select({})) as PersonRow[];
  console.log("people", people.length);
  people = people.slice(0, 6);
  const peopleWithSpouse = people.filter((row) => !!row.spouse);
  const input = [
    {
      pointer: "",
      tag: "HEAD",
      data: "",
      tree: [
        {
          pointer: "",
          tag: "SOUR",
          data: "Древо Жизни 2 GedCom",
          tree: [{ pointer: "", tag: "VERS", data: "1", tree: [] }],
        },
        { pointer: "", tag: "CHAR", data: "UTF-8", tree: [] },
        {
          pointer: "",
          tag: "GEDC",
          data: "",
          tree: [
            { pointer: "", tag: "VERS", data: "5.5.1", tree: [] },
            { pointer: "", tag: "FORM", data: "Lineage-Linked", tree: [] },
          ],
        },
        { pointer: "", tag: "SUBM", data: "@U0@", tree: [] },
      ],
    },
    {
      pointer: "@U0@",
      tag: "SUBM",
      data: "",
      tree: [{ pointer: "", tag: "NAME", data: "Slawa", tree: [] }],
    },
    ...people.map((p1) => ({
      pointer: `@I${p1.id}@`,
      tag: "INDI",
      data: "",
      tree: propsToTree(p1),
    })),
    ...peopleWithSpouse.map((p1) => ({
      pointer: getFamilyId(p1),
      tag: "FAM",
      data: "",
      tree: familyToTree(p1),
    })),
    {
      pointer: "",
      tag: "TRLR",
      data: "",
      tree: [],
    },
  ];
  console.dir(input, { depth: null });
  await fs.writeFile("family.ged", astToGedcom(input));
});

function propsToTree(p1: PersonRow) {
  delete p1.x1;
  delete p1.x2;
  delete p1.y1;
  delete p1.y2;
  delete p1.pl_short;
  delete p1.de;
  delete p1.di;
  delete p1.sex;
  delete p1.alive;
  delete p1.doc;
  delete p1.lifespan;
  delete p1.age;
  console.dir(p1, { depth: null });
  const props = Object.entries(p1).filter(([key, val]) => {
    return !!val;
  });
  const personTree = props.map((prop) => {
    let tree = [];
    let propValue = prop[1];
    if (propValue instanceof Date) {
      propValue.setHours(propValue.getHours() + 5);
      propValue = propValue
        .toLocaleString("en-DE", {
          month: "short",
          year: "numeric",
          day: "2-digit",
        })
        .toUpperCase();
    }
    if (prop[0] === "sex") {
      propValue = propValue === 0 ? "male" : "female";
    }
    if (prop[0] === "death") {
      tree = [
        {
          pointer: "",
          tag: "CAUS",
          data: p1.dreason,
          tree: [],
        },
      ];
    }
    if (prop[0] === "msn") {
      tree = [{ pointer: "", tag: "TYPE", data: "maiden", tree: [] }];
    }
    if (prop[0] === "spouse") {
      return {
        pointer: "",
        tag: "FAMC",
        data: getFamilyId(p1),
        tree: [],
      };
    }
    if (prop[0] === "fullname") {
      return {
        pointer: "",
        tag: "NAME",
        data: propValue,
        tree: [
          { pointer: "", tag: "GIVN", data: p1.fn, tree: [] },
          { pointer: "", tag: "SURN", data: p1.sn, tree: [] },
          { pointer: "", tag: "SPFX", data: p1.mn, tree: [] },
        ],
      };
    }
    let tag = propToGedcom[prop[0]];
    if (!tag) {
      return null;
    }
    return {
      pointer: "",
      tag,
      data: propValue,
      tree,
    };
  });
  return personTree.filter((node) => !!node);
}

const propToGedcom = {
  pl_full: "ADDR",
  bfdate: "BIRT",
  death: "DEAT",
  occu: "OCCU",
  sex: "SEX",
  fullname: "NAME",
  comment: "NOTE",
  msn: "NAME",
};

function familyToTree(p1: PersonRow) {
  let spouseList = Array.isArray(p1.spouse) ? p1.spouse : [p1.spouse];
  let mainSpouse =
    spouseList[0].sex === "M"
      ? {
          pointer: "",
          tag: "WIFE",
          data: p1.id,
          tree: [],
        }
      : {
          pointer: "",
          tag: "HUSB",
          data: p1.id,
          tree: [],
        };

  return [
    mainSpouse,
    ...spouseList.flatMap((spouse) => {
      // console.log("FAM", p1.id, p1.spouse);
      let childList = Array.isArray(spouse.child)
        ? spouse.child
        : [spouse.child];
      let children = childList?.map((child) => ({
        pointer: "",
        tag: "CHIL",
        data: child.id,
        tree: [],
      }));
      return [
        spouse.sex === "M"
          ? {
              pointer: "",
              tag: "HUSB",
              data: spouse.id,
              tree: [],
            }
          : {
              pointer: "",
              tag: "WIFE",
              data: spouse.id,
              tree: [],
            },
        ...children,
      ];
    }),
  ];
}

function getFamilyId(p1: PersonRow) {
  let firstSpouse = p1.spouse?.id ?? p1.spouse[0].id;
  return `@F${p1.id.substring(3)}-${firstSpouse.substring(3)}@`;
}
