import {AnyAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {authApi, ResponseTypeAuth} from "1-DAL/authApi";
import {createAppAsyncThunk} from "3-UI/u4-common/utilits/create-app-async-thunk";

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

const authorisedWithPassword = createAppAsyncThunk<ResponseTypeAuth, AuthorisedWithPasswordArgsType>(
    "auth/authorisedWithPassword",
    async ({login, password, client_id, client_secret, hr}, {rejectWithValue, getState}) => {
        try {
            let res = await authApi.authorisedWithPassword({login, password, client_id, client_secret, hr})
            return res.data
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const refreshToken = createAppAsyncThunk<ResponseTypeAuth>(
    "auth/refreshToken",
    async (_, { rejectWithValue, getState}) => {
        const refreshToken = getState().auth.userAuthData.refresh_token
        try {
            let res = await authApi.refreshToken(refreshToken)
            return res.data
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        isLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
            state.isLoading = action.payload.isLoading
        },
        setError: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error
        },
        setAuthorised: (state, action: PayloadAction<{ isAuthorised: boolean }>) => {
            state.isAuthorised = true
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authorisedWithPassword.fulfilled, (state, action) => {
            state.userAuthData = action.payload;
            state.isAuthorised = true
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.userAuthData = action.payload;
        });
        builder.addMatcher((action: AnyAction) => {
            return action.type.endsWith('/pending')
        }, (state, action) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addMatcher((action: AnyAction) => {
            return action.type.endsWith('/rejected')
        }, (state, action) => {
            state.isLoading = false
            const e = action.payload.error
            if (action.payload) {
                if (axios.isAxiosError<ErrorType>(e)) {
                    state.error = e.response?.data ? e.response.data.error.message : e.message
                } else {
                    state.error = 'Some error occurred'
                }
            } else {
                state.error = 'Some error occurred'
            }
        });
        builder.addMatcher((action: AnyAction) => {
            return action.type.endsWith('/fulfilled')
        }, (state, action) => {
            state.isLoading = false
        })

    },
})

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = {authorisedWithPassword, refreshToken};

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