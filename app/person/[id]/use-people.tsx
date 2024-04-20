"use client";

import useSWR from "swr";
import { fetcher } from "../../fetcher";

export function usePeople() {
	const { data, isLoading, mutate, error } = useSWR(`/api/people`, fetcher);
	return { people: data?.people ?? [], isLoading, mutate, error };
}
