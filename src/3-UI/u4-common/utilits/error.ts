import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import axios from "axios";
import {Dispatch} from "react";

/**
 * Function works with App errors
 * @param e - response about any error type
 * @param dispatch - function, which send an error to Redux
 * @param setErrorAC - function, which sets error in a state
 */

export const errorHandler = (e: any,
                             dispatch: Dispatch<any>,
                             setErrorAC: ActionCreatorWithPayload<{ error: string; }, any >) => {
    if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response?.data ? e.response.data.error.message : e.message
        dispatch(setErrorAC({error}))
    } else {
        dispatch(setErrorAC({error: 'Some error'}))
    }
}

type ErrorType = {
    error: {
        code: string,
        message: string
    }
}