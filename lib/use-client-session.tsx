"use client";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { useEffect, useState } from "react";

export interface ClientSession {
	user?: string; // email
}

export function useClientSession() {
	const [state, setState] = useState<ClientSession>({});
	const { isLoading, data, mutate } = useSWR<ClientSession>(
		"/api/auth/me",
		fetcher,
	);
	useEffect(() => {
		if (!data) {
			return;
		}
		setState(data);
	}, [data]);
	return { isLoading, ...state, mutate };
}
