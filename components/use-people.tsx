"use client";

import useSWR from "swr";
import { fetcher } from "../lib/common/fetcher.tsx";

export function usePeople() {
	const { data, isLoading, mutate, error } = useSWR(`/api/people`, fetcher);
	return { people: data?.people ?? [], isLoading, mutate, error };
}
