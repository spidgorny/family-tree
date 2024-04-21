declare module 'json-sql' {
	class Builder {
		constructor(options: any);
		setDialect(dialect: string)
	}
	export = (options: any) => Builder(options)
}
