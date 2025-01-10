"use client";
import useSWR from "swr";
import { fetcher } from "./common/fetcher.tsx";
import { useEffect, useState } from "react";
import { Node } from "../components/apextree/models";

export interface ServerSession {
	user?: string; // email
}

export interface ClientSession {
	user?: Node;
}

export function useClientSession() {
	const { isLoading, data, mutate } = useSWR<ClientSession>(
		"/api/auth/me",
		fetcher,
	);
	// console.log("useClientSession", data);
	return { isLoading, ...data, mutate } as ClientSession & {
		isLoading: boolean;
		mutate: () => void;
	};
}
