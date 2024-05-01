"use client";

import useSWR from "swr";
import { fetcher } from "../lib/common/fetcher.tsx";
import { PersonRowNormalized } from "../test/types.ts";

export function usePeople() {
	const { data, isLoading, mutate, error } = useSWR(`/api/people`, fetcher);
	return {
		people: data?.people ?? ([] as PersonRowNormalized[]),
		isLoading,
		mutate,
		error,
	} as {
		people: PersonRowNormalized[];
		isLoading: boolean;
		mutate: () => void;
		error?: Error;
	};
}
