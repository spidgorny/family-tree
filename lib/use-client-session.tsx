"use client";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

export function useClientSession() {
	const { isLoading, data, mutate } = useSWR("/api/auth/me", fetcher);
	return { isLoading, ...data, mutate };
}
