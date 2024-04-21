import { runTest } from "./bootstrap";
import { getDb } from "../lib/mysql/db-config";
// @ts-ignore
import astToGedcom from "generate-gedcom";
import fs from "fs/promises";
import { Child, PersonRow, Spouse } from "./types";

void runTest(async () => {
	const tPerson = (await getDb()).getTable("people");
	let people = (await tPerson.select({})) as PersonRow[];
	console.log("people", people.length);
	// people = people.slice(0, 6);
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
		...peopleWithSpouse.flatMap((p1) => familyToTree(p1)),
		{
			pointer: "",
			tag: "TRLR",
			data: "",
			tree: [],
		},
	];
	console.dir(input.slice(-10), { depth: null });
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
	const personTree = props.flatMap((prop) => {
		let tree: any[] = [];
		let propValue = prop[1];
		if (propValue instanceof Date) {
			propValue.setHours(propValue.getHours() + 5);
			propValue = propValue
				.toLocaleString("en-DE", {
					month: "short",
					year: "numeric",
					day: "2-digit",
				})
				.toUpperCase()
				.replace("SEPT", "SEP");
			let tag = propToGedcom[prop[0]];
			return {
				pointer: "",
				tag,
				data: "",
				tree: [{ pointer: "", tag: "DATE", data: propValue, tree: [] }],
			};
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
		if (prop[0] === "pl_full") {
			return {
				pointer: "",
				tag: "RESI",
				data: "",
				tree: [{ pointer: "", tag: "ADDR", data: propValue, tree: [] }],
			};
		}
		if (prop[0] === "spouse") {
			return {
				pointer: "",
				tag: "FAMC",
				data: getFamilyId(
					p1,
					Array.isArray(p1.spouse) ? p1.spouse[0] : p1.spouse!,
				),
				tree: [],
			};
		}
		if (prop[0] === "fullname") {
			return {
				pointer: "",
				tag: "NAME",
				data: propValue,
				tree: [
					p1.fn ? { pointer: "", tag: "GIVN", data: p1.fn, tree: [] } : null,
					p1.sn ? { pointer: "", tag: "SURN", data: p1.sn, tree: [] } : null,
					p1.mn ? { pointer: "", tag: "SPFX", data: p1.mn, tree: [] } : null,
				].filter(Boolean),
			};
		}
		if (prop[0] === "comment") {
			let commentLines = propValue
				.split("\n")
				.flatMap((longLine) => longLine.match(/.{1,200}(?:\s|$)/g));
			return {
				pointer: "",
				tag: "NOTE",
				data: commentLines[0],
				tree: commentLines.slice(1).map((line) => ({
					pointer: "",
					tag: "CONC",
					data: line,
					tree: [],
				})),
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
	return spouseList.map((spouse: Spouse) => genFamily(p1, spouse));
}

function genFamily(p1: PersonRow, spouse: Spouse) {
	let mainSpouse =
		spouse.sex === "M"
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

	// console.log("FAM", p1.id, p1.spouse);
	let childList = Array.isArray(spouse.child) ? spouse.child : [spouse.child];
	// console.log(JSON.stringify(childList));
	let children = childList?.filter(Boolean)?.map((child: Child) => ({
		pointer: "",
		tag: "CHIL",
		data: child.id,
		tree: [],
	}));
	let secondSpouse =
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
				};
	return {
		pointer: getFamilyId(p1, spouse),
		tag: "FAM",
		data: "",
		tree: [mainSpouse, secondSpouse, ...children],
	};
}

function getFamilyId(p1: PersonRow, spouse: Spouse) {
	if (!spouse) {
		throw new Error(`no spouse in ${JSON.stringify(p1.spouse)}`);
	}
	return `@F${p1.id.substring(3)}-${spouse.id.substring(3)}@`;
}
