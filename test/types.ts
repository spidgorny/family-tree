export type Child = { id: string; sex: "M" | "F" };
export type Spouse = {
	id: string;
	sex: "M" | "F";
	marriage: "" | { date: string };
	child: [Child];
};

export interface PersonRow {
	id: string;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	alive: boolean;
	de: Date;
	di: Date;
	fn: string;
	fullname: string;
	sex: string;
	spouse?: Spouse | Spouse[];
	msn: string;
	mn: string;
	father: string;
	mother: string;
	occu: string;
	age: number;
	bfdate: Date;
	pl_full: string;
	pl_short: string;
	doc: {
		preview: string;
	};
	comment: string;
	sn: string;
	dfdate: string;
	lifespan: string;
	dreason: string;
	bplace: string;
	bfplace: string;
}
