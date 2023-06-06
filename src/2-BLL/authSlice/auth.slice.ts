import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isAuthorised: false,
    isLoading: false,
    error: '',
    userAuthData: {
        "access_token": '',
        "refresh_token": '',
        "ttl": null,
        "expires_in": null,
        "token_type": '',
    } as UserAuthDataType,
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthorisedData: (state, action: PayloadAction<{
            "access_token": string,
            "refresh_token": string,
            "ttl": number | null,
        }>) => {
            state.userAuthData.refresh_token = action.payload.refresh_token
            state.userAuthData.access_token = action.payload.access_token
            state.userAuthData.ttl = action.payload.ttl
        },
    },
})

export const authReducer = slice.reducer;
export const authActions = slice.actions;

// types

export type AuthInitialStateType = typeof initialState
type AuthorisedWithPasswordArgsType = { login: string, password: string, client_id: number, client_secret: string, hr: number }
export type UserAuthDataType = {
    "access_token": string,
    "refresh_token": string,
    "ttl": number | null,
    "expires_in": number | null,
    "token_type": string,
}

export type ErrorType = {
    error: {
        code: string,
        message: string
    }
}