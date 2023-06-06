import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ResponseTypeVacancies, VacanciesParams, VacancyInfo} from "./vacancies.types";
import {AppRootStateType} from "../../store";


export const vacanciesSlice = createApi({
    reducerPath: "vacanciesSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://startup-summer-2023-proxy.onrender.com/2.0/",
        credentials: "include",
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as AppRootStateType).auth.userAuthData.access_token
            headers.set('x-secret-key', 'GEU4nvd3rej*jeh.eqp')
            headers.set('X-Api-App-Id', 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948')
            headers.set('Authorization', `Bearer ${token}`)
            return headers
        },
    }),
    endpoints: (build) => {
        return {
            getVacancies: build.query<ResponseTypeVacancies, VacanciesParams>({
                query: ({ page, count, keyword, payment_from, payment_to, catalogues}) => {
                    return {
                        method: "GET",
                        url: "vacancies",
                        params: {
                            published: 1,
                            page,
                            count,
                            keyword,
                            payment_from,
                            payment_to,
                            catalogues
                        },
                    };
                },
            }),
            getVacancy: build.query<VacancyInfo, string>({
                query: (id: string) => {
                    return {
                        method: "GET",
                        url: `vacancies/${id}/`,
                        params: {
                            published: 1,
                            id
                        },
                    };
                },
            }),
        };
    },
});

export const {useLazyGetVacanciesQuery, useGetVacancyQuery} = vacanciesSlice;

