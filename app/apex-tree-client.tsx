"use client";
import { ApexTree } from "apextree/src/apextree";
import { useEffect, useRef } from "react";
import { Node} from 'apextree/src/models';
import { TreeDirection } from "apextree/src/settings/Options";

export default function ApexTreeClient(props: {data: Node}) {
	const ref = useRef<HTMLDivElement>();

	useEffect(() => {
		const options = {
			width: 700,
			height: 700,
			nodeWidth: 120,
			nodeHeight: 80,
			childrenSpacing: 100,
			siblingSpacing: 30,
			direction: "top" as TreeDirection,
			canvasStyle: "border: 1px solid black; background: #f6f6f6;",
			enableToolbar: true
		};

		let svgTreeDiv = ref.current;
		if (!svgTreeDiv) {
			return;
		}
		const tree = new ApexTree(svgTreeDiv, options);
		const graph = tree.render(props.data);
		console.log(graph);

	}, []);

	return <div id="svg-tree" ref={ref}></div>;
}
