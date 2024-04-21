"use client";

import { createContext, PropsWithChildren, useState } from "react";

export const SearchContext = createContext<{
	q: string;
	onChange: (q: string) => void;
}>({
	q: "",
	onChange: () => {},
});

export function SearchContextProvider(props: PropsWithChildren) {
	const [state, setState] = useState("");
	const value = {
		q: state,
		onChange: setState,
	};
	return (
		<SearchContext.Provider value={value}>
			{props.children}
		</SearchContext.Provider>
	);
}
