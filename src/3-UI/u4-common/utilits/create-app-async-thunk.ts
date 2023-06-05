import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, AppRootStateType} from "2-BLL/store";

/**
 * add types to createAsyncThunk
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue: null | ErrorType
}>()

type ErrorType = {
    error: any
}
