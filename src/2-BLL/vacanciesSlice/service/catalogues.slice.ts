import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { ResponseTypeCatalogues } from "./vacancies.types";

export const cataloguesSlice = createApi({
    reducerPath: "cataloguesSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://startup-summer-2023-proxy.onrender.com/2.0/",
        credentials: "include",
        prepareHeaders: (headers) => {
            headers.set('x-secret-key', 'GEU4nvd3rej*jeh.eqp')
            headers.set('X-Api-App-Id', 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948')
            return headers
        },
    }),
    endpoints: (build) => {
        return {
            getCatalogues: build.query<ResponseTypeCatalogues[], unknown>({
                query: () => {
                    return {
                        method: "GET",
                        url: "catalogues",
                        params: {

                        }
                    };
                },
            }),
        };
    },
});

export const {useLazyGetCataloguesQuery} = cataloguesSlice;

