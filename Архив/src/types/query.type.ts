export interface ResponseType<S> {
	data: S;
	currentPage: number;
	perPageCount: number;
	total: number;
}

export interface QueryType {
	data?: any;
	currentPage: number;
}
