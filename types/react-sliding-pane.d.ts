declare module "react-sliding-pane" {
	import { ReactNode } from "react";

	export interface ReactSlidingPaneProps {
		isOpen?: boolean;
		title?: ReactNode;
		subtitle?: ReactNode;
		from?: "left" | "right" | "bottom";
		children: ReactNode;
		className?: string;
		overlayClassName?: string;
		width?: string;
		closeIcon?: ReactNode;
		shouldCloseOnEsc?: boolean;
		hideHeader?: boolean;
		onRequestClose: () => void;
		onAfterOpen?: () => void;
		onAfterClose?: () => void;
	}

	const SlidingPane: (props: ReactSlidingPaneProps) => ReactNode;
	export default SlidingPane;
}
