import SlidingPane from "react-sliding-pane";
import { PropsWithChildren, ReactElement, ReactNode } from "react";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useMediaQuery } from "usehooks-ts";

export function SlidingPaneAutoWidth(
	props: PropsWithChildren<{
		title: string;
		isOpen: boolean;
		onRequestClose: () => void;
	}>,
) {
	const isLargeScreen = useMediaQuery("(min-width: 768px)");

	return (
		<SlidingPane
			title={props.title}
			isOpen={props.isOpen}
			width={isLargeScreen ? "50%" : "100%"}
			onRequestClose={props.onRequestClose}
		>
			<>
				<style>
					{`
						.slide-pane__header {
							background-color: #ddd;
						}
						.slide-pane__content {
							background-color: #eee;
						}						
				`}
				</style>
				{props.children}
			</>
		</SlidingPane>
	);
}
