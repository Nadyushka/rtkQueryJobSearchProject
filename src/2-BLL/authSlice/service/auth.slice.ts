import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {authParams, ResponseTypeAuth} from "./auth.types";

export const authSlice = createApi({
    reducerPath: "authSlice",
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
            authoriseWithPassword: build.query<ResponseTypeAuth, authParams>({
                query: ({login, password, client_id, client_secret, hr}) => {
                    return {
                        method: "GET",
                        url: "oauth2/password",
                        params: {
                            login, password, client_id, client_secret, hr
                        },
                    };
                },
            }),
            refreshToken: build.query<ResponseTypeAuth, string>({
                query: (refresh_token) => {
                    return {
                        method: "GET",
                        url: "refresh_token/",
                        params: {
                            refresh_token,
                            client_id: 2356,
                            client_secret: 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948'
                        },
                    };
                },
            }),
        };
    },
});

export const {useLazyAuthoriseWithPasswordQuery, useLazyRefreshTokenQuery} = authSlice;

