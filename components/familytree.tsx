import FamilyTree from "../lib/family-tree.cjs";
import {useEffect, useState} from "react";
import axios from "axios";

export function Familytree(props) {
	if (typeof window === "object") {
		const family = new FamilyTree(document.getElementById("tree"), {
			nodeBinding: props.nodeBinding,
			nodes: props.nodes,
			filterBy: "all",
			// orientation: FamilyTree.orientation.left,
		});

		family.on("init", () => {
			// family?.center("HU1DHXjkMZ");
			setTimeout(() => {
				family?.center("gqFq9x3Si0");
			}, 1000);
		});

		family.on("expcollclick", (sender, isCollapsing, nodeId) => {
			const node = family.getNode(nodeId);
			if (isCollapsing) {
				family.expandCollapse(nodeId, [], node.stChildrenIds);
			} else {
				family.expandCollapse(nodeId, node.stChildrenIds, []);
			}
			return false;
		});

		// @ts-ignore
		family.onUpdateNode(({oldData: {updateNodesData}}) => {
			//return false; to cancel the operation
			console.log("updateNode", updateNodesData[0]);
		});

		// @ts-ignore
		family.on("updateNode", ({oldData: {updateNodesData}}) => {
			//return false; to cancel the operation
			console.log("updateNode", updateNodesData[0]);
		});
	}
	return null;
}

export const defaultTree = [
	{
		id: 1,
		pids: [2],
		name: "Amber McKenzie",
		gender: "female",
		img: "https://cdn.balkan.app/shared/2.jpg",
	},
	{
		id: 2,
		pids: [1],
		name: "Ava Field",
		gender: "male",
		img: "https://cdn.balkan.app/shared/m30/5.jpg",
	},
	{
		id: 3,
		mid: 1,
		fid: 2,
		name: "Peter Stevens",
		gender: "male",
		img: "https://cdn.balkan.app/shared/m10/2.jpg",
	},
	{
		id: 4,
		mid: 1,
		fid: 2,
		name: "Savin Stevens",
		gender: "male",
		img: "https://cdn.balkan.app/shared/m10/1.jpg",
	},
	{
		id: 5,
		mid: 1,
		fid: 2,
		name: "Emma Stevens",
		gender: "female",
		img: "https://cdn.balkan.app/shared/w10/3.jpg",
	},
];
export const nodeBinding = {
	field_0: "name",
	img_0: "img",
};

export function FamilytreeLoader() {
  // const [json, setJSON] = useState();
  const [data, setData] = useState(defaultTree);
  useEffect(() => {
    async function readXML() {
      const {data: json} = await axios.get("/api/people");
      // setJSON(json);

      // let data = json.agelongtree.Pers.r;
      let data = json.people;
      data = data.map((pers) => {
        let spouseList = Array.isArray(pers.spouse)
          ? pers.spouse?.map((x) => x.id)
          : [pers.spouse?.id];
        return {
          ...pers,
          ID: pers.id,
          pids: [
            ...spouseList,
            ...data.filter((x) => x.spouse?.id === x.id).map((x) => x.id),
          ].filter(Boolean),
          mid: pers.mother?.id,
          fid: pers.father?.id,
          name: pers.fullname,
          gender: pers.sex === "F" ? "female" : "male",
          img: pers.doc?.file ? `/export.xml.files/${pers.doc?.file}` : null,
        };
      }) as Array<any>;

      // let rootPerson = "gqFRIyL03L";
      // let rootIndex = data.findIndex((x) => x.id === rootPerson);
      // if (rootIndex !== -1) {
      //   let rootData = data[rootIndex];
      //   data.splice(rootIndex, 1);
      //   data = [rootData, ...data];
      //   console.dir(data, { depth: 1 });
      // }
      let vip = [
        "HU1DHXjkMZ", // Stefan
        "gqFq9x3Si0", // Oles
        "gqFQMJitsg",
        "gqFP6EHc2u",
        "gqFwVrUSzH",
        "gqFqx51ldp",
        "gqFRIyL03L",
      ];
      let data1 = data.filter((x) => vip.includes(x.id));
      let data2 = data.filter((x) => !vip.includes(x.id));
      data = [...data1, ...data2];

      setData(data);
    }

    readXML().then();
  }, []);

  return <>
    <div id="tree" style={{width: "100%", minHeight: "100vh"}}/>
    <Familytree nodes={data} nodeBinding={nodeBinding}/>
  </>
}
