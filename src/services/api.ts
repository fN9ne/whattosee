import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IUser {
	id: number;
	name: string;
	color: number;
	latest: IUserLatest;
}

export interface IUserLatest {
	duets: number[];
	films: IUserLatestFilm[];
}

export interface IUserLatestFilm {
	owner: number;
	filmId: number;
}

export interface IFilm {
	id: number;
	name: string;
	owner: number;
}

export interface IDuetFilm {
	filmId: number;
	owner: number;
}

export interface IDuet {
	id: number;
	firstUser: number;
	secondUser: number;
	items: IDuetFilm[];
	watched: IDuetFilm[];
}

export interface IFetchData {
	users: IUser[];
	items: IFilm[];
	duets: IDuet[];
}

export interface IFetchDataUpdate {
	record: IFetchData;
	metadata: {
		parentId: string;
		private: boolean;
	};
}

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e",
		prepareHeaders(headers) {
			headers.set("X-Master-Key", "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe");
			headers.set("X-Access-Key", "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6");

			return headers;
		},
	}),
	endpoints: (builder) => ({
		read: builder.query<IFetchData, void>({
			query: () => ({
				url: "/latest?meta=false",
				method: "GET",
			}),
		}),
		update: builder.mutation<IFetchDataUpdate, IFetchData>({
			query: (data) => ({
				url: "?meta=false",
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}),
		}),
	}),
});

export const { useLazyReadQuery, useUpdateMutation } = api;
