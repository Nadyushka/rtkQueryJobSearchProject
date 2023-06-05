import {authThunks} from "2-BLL/authSlice/auth.slice";
import {Dispatch} from "react";

/**
 * Check token validation. If it expired, update
 * @param ttl - validity period for token. It is received after authorization
 * @param dispatch - function, which send data to Redux
 */

export const checkTokenValidity = (ttl: number | null, dispatch: Dispatch<any>) => {
    if (ttl && ttl < Date.now()) {
        dispatch(authThunks.refreshToken())
    }
}