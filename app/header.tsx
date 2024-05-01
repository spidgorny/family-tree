"use client";
import axios from "axios";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useClientSession } from "../lib/use-client-session";
import { SearchContext } from "./search-context";
import { SlidingPaneAutoWidth } from "../components/sliding-page-auto-width.tsx";

export function MainHeader() {
	return (
		<header className="bg-dark p-2 d-flex justify-content-between">
			<h4>
				<Link href="/" className="text-decoration-none text-white">
					🌲 Family Tree
				</Link>
			</h4>
			<LoginGuard blank={true}>
				<SearchForm />
			</LoginGuard>
			<SignInOrOut />
		</header>
	);
}

function SignInOrOut() {
	const session = useClientSession();
	const [state, setState] = useState(session.user);

	useEffect(() => {
		setState(session.user);
	}, [session.user]);

	if (session.isLoading) {
		session.user = state;
	}
	if (session.user) {
		return <SignOut onSuccess={() => session.mutate()} />;
	}
	return <SignIn onSuccess={() => session.mutate()} />;
}

function SignIn(props: { onSuccess: () => void }) {
	const [openPanel, setOpenPanel] = useState(false);
	return (
		<div>
			<button
				onClick={() => setOpenPanel(true)}
				className="btn btn-outline-primary"
			>
				Sign In
			</button>
			<SlidingPaneAutoWidth
				title="Sign-in with email + date of birth"
				isOpen={openPanel}
				onRequestClose={() => setOpenPanel(false)}
			>
				<SignInForm
					onSuccess={() => {
						setOpenPanel(false);
						props.onSuccess();
					}}
				/>
				<div className="py-5 my-5 text-end">
					<button
						onClick={() => setOpenPanel(false)}
						className="btn btn-outline-secondary"
					>
						close
					</button>
				</div>
			</SlidingPaneAutoWidth>
		</div>
	);
}

function SignInForm(props: { onSuccess: () => void }) {
	const [error, setError] = useState<Error | null>(null);

	const signIn = async (e: any) => {
		e.preventDefault();
		setError(null);
		const data = Object.fromEntries(new FormData(e.target).entries());
		console.log("sign in", data);
		try {
			const res = await axios.post("/api/auth/login", data);
			console.log("res", res);
			props.onSuccess();
		} catch (e) {
			console.error(e);
			setError(
				e?.response?.data?.status ? new Error(e?.response?.data?.status) : e,
			);
		}
	};

	return (
		<form onSubmit={signIn}>
			<label className="d-block form-floating mb-3">
				Email address
				<input
					type="email"
					name="email"
					className="form-control"
					placeholder="name@example.com"
				/>
			</label>
			<label className="d-block form-floating mb-3">
				Date of Birth
				<input
					type="date"
					name="dateOfBirth"
					className="form-control"
					placeholder="2020-01-01"
				/>
			</label>

			<button className="btn btn-primary w-100 py-2" type="submit">
				Sign in
			</button>

			{error && <div className="alert alert-danger mt-3">{error.message}</div>}
		</form>
	);
}

function SignOut(props: { onSuccess: () => void }) {
	const signOut = async () => {
		const res = await axios.post("/api/auth/logout");
		console.log("res", res);
		props.onSuccess();
	};

	return (
		<button onClick={signOut} className="btn btn-outline-secondary">
			Sign Out
		</button>
	);
}

function SearchForm() {
	const context = useContext(SearchContext);
	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<input
				type="search"
				className="form-control"
				onChange={(e) => context.onChange(e.target.value)}
				placeholder="search by name"
			/>
		</form>
	);
}

export function LoginGuard(props: PropsWithChildren<{ blank?: boolean }>) {
	const session = useClientSession();
	if (session.user) {
		return props.children;
	}

	if (props.blank) {
		return "";
	}

	return (
		<div className="d-flex flex-column align-items-center gap-5 justify-content-center my-5 py-5 border rounded">
			<p>
				Here's the family tree of various people related to the family name
				Pidgornyy/Sigayeva
			</p>
			<SignInOrOut />
		</div>
	);
}
