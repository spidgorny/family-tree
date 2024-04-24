export type Child = { id: string; sex: "M" | "F" };
export type Spouse = {
	id: string;
	sex: "M" | "F";
	marriage: "" | { date: string };
	child: [Child];
};

export interface PersonRow {
	id: string;
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
	alive?: boolean;
	de?: Date;
	di?: Date;
	email: string;
	fn: string;
	fullname: string;
	sex?: string;
	spouse?: Spouse | Spouse[];
	msn: string;
	mn: string;
	father?: { id: string };
	mother: { id: string };
	occu: string;
	age?: number;
	bfdate: Date;
	pl_full: string;
	pl_short?: string;
	doc?: {
		preview: string;
	};
	comment: string;
	sn: string;
	dfdate: Date;
	lifespan?: string;
	dreason: string;
	bplace: string;
	bfplace: string;
}

export interface PersonRowNormalized extends PersonRow {
	spouse: Spouse[];
}

export interface CommentRow {
	id: string;
	id_person: string;
	created_at: Date;
	created_by: string;
	bodytext: string;
}
