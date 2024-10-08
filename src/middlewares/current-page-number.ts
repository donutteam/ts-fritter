//
// Imports
//

import { FritterContext } from "../classes/FritterContext.js";

import { MiddlewareFunction } from "../types/MiddlewareFunction.js";

//
// Interfaces
//

export interface MiddlewareFritterContext extends FritterContext
{
	/** @deprecated */
	currentPage : number;

	currentPageNumber : number;
}

//
// Create Function
//

export interface CreateOptions
{
	getPageNumber? : (context : MiddlewareFritterContext) => number;
}

export interface CreateResult
{
	execute : MiddlewareFunction<MiddlewareFritterContext>;
}

export function create(options : CreateOptions = {}) : CreateResult
{
	const getPageNumber = options.getPageNumber ??
		((context) =>
		{
			let currentPage = parseInt(context.fritterRequest.getSearchParams().get("page") ?? "1");

			if (isNaN(currentPage))
			{
				currentPage = 1;
			}

			return currentPage;
		});

	return {
		execute: async (context, next) =>
		{
			const currentPageNumber = getPageNumber(context);

			context.currentPage = currentPageNumber;

			context.currentPageNumber = currentPageNumber;

			await next();
		},
	};
}