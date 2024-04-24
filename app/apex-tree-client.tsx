"use client";
import { ApexTree } from "../components/apextree/ApexTree";
import { useEffect, useRef } from "react";
import { Node } from "../components/apextree/models";
import {
	TreeDirection,
	TreeOptions,
} from "../components/apextree/settings/Options";
import { PersonRowNormalized } from "../test/types";
import { useRouter } from "next/navigation";

export default function ApexTreeClient(props: {
	id: string;
	data: Node;
	direction?: TreeDirection;
}) {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// @ts-ignore
		window.nextRouter = router;
		const options = {
			width: ref.current?.offsetWidth ?? 800,
			height: 1024,
			nodeWidth: 120,
			nodeHeight: 80,
			childrenSpacing: 100,
			siblingSpacing: 30,
			direction: props.direction ?? ("bottom" as TreeDirection),
			canvasStyle: "border: 1px solid black; background: #f6f6f6;",
			enableToolbar: false,
			nodeTemplate: (content: string, node: Node & PersonRowNormalized) => {
				// console.log(node);
				return `<div style='display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%;'>
<div style="flex-grow: 1"><a href="?person=${node?.id}" style="text-decoration: none;" class="CleverLink">${content}</a></div>
<div style="min-height: 0.5em; width: 100%; background-color: ${node?.sex === "1" ? "#8dd7fe" : "#e0b9fe"}; font-size: 10pt">
<a href="/person/${node?.id}" style="text-decoration: none" class="CleverLink">&gt; more</a>
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
		svgTreeDiv.innerHTML = "";
		const tree = new ApexTree(svgTreeDiv, options);
		tree.render(props.data);
		// console.log(graph);
		let listener = (e: Event) => {
			e.preventDefault();
			let target = e.target as HTMLAnchorElement;
			console.log("clicked", target);
			let href = target.getAttribute("href");
			if (!href) {
				return;
			}
			// @ts-ignore
			window.nextRouter.push(href);
		};
		[...document.querySelectorAll("a.CleverLink")].map((aHref) => {
			aHref.addEventListener("click", listener);
		});
		return () => {
			[...document.querySelectorAll("a.CleverLink")].map((aHref) => {
				aHref.removeEventListener("click", listener);
			});
		};
	}, []);

	return (
		<div
			id={`svg-tree-${props.id}`}
			ref={ref}
			style={{ maxWidth: "100%" }}
		></div>
	);
}
