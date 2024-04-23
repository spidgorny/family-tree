"use client";
import { ApexTree } from "apextree/src/apextree.ts";
import { useEffect, useRef } from "react";
import { Node } from "apextree/src/models";
import { TreeDirection, TreeOptions } from "apextree/src/settings/Options";
import { PersonRowNormalized } from "../test/types";

export default function ApexTreeClient(props: {
	id: string;
	data: Node;
	direction?: TreeDirection;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const options = {
			width: 1024,
			height: 1024,
			nodeWidth: 120,
			nodeHeight: 80,
			childrenSpacing: 100,
			siblingSpacing: 30,
			direction: props.direction ?? ("bottom" as TreeDirection),
			canvasStyle: "border: 1px solid black; background: #f6f6f6;",
			enableToolbar: false,
			nodeTemplate: (content: string, node: Node & PersonRowNormalized) => {
				console.log(node);
				return `<div style='display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%;'>
<div style="flex-grow: 1"><a href="?person=${node?.id}" style="text-decoration: none;">${content}</a></div>
<div style="min-height: 0.5em; width: 100%; background-color: ${node?.sex === "1" ? "#8dd7fe" : "#e0b9fe"}; font-size: 10pt">
<a href="/person/${node?.id}">&gt; more</a>
</div></div>`;
			},
			nodeBGColor: "#ffffff",
			nodeBGColorHover: "#eee",
			edgeColor: "#BCBCBC",
			edgeColorHover: "#BCBCBC",
			enableTooltip: true,
			tooltipId: "apextree-tooltip-container",
			tooltipTemplate: (content: string) => {
				return `<div style='display: flex; justify-content: center; align-items: center; text-align: center; height: 100%;'>${content}</div>`;
			},
			tooltipMaxWidth: 100,
			tooltipBorderColor: "#BCBCBC",
			tooltipBGColor: "#ffffff",
			fontSize: "10pt",
		} as TreeOptions;

		let svgTreeDiv = ref.current;
		if (!svgTreeDiv) {
			return;
		}
		const tree = new ApexTree(svgTreeDiv, options);
		const graph = tree.render(props.data);
		console.log(graph);
	}, []);

	return (
		<div
			id={`svg-tree-${props.id}`}
			ref={ref}
			style={{ maxWidth: "100%" }}
		></div>
	);
}
