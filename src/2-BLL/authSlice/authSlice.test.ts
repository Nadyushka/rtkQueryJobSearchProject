import {authActions, AuthInitialStateType, authReducer, authThunks} from "./auth.slice";

describe('authReducers actions test', () => {

    let startState: AuthInitialStateType

    beforeEach(() => {
        startState = {
            isAuthorised: false,
            isLoading: false,
            error: '',
            userAuthData: {
                "access_token": '',
                "refresh_token": '',
                "ttl": null as number | null,
                "expires_in": null as number | null,
                "token_type": '',
            }
        }
    })


    it('should set correct loading status', () => {
        const endState = authReducer(startState, authActions.isLoading({isLoading: true}))
        expect(endState.isLoading).toBeTruthy()
    })

    it('should set correct error', () => {
        const endState = authReducer(startState, authActions.setError({error: 'some error'}))
        expect(endState.error).toBe('some error')
    })

    it('should return correct data after authorization', () => {

        const argData = {login: 'dddd', password: '', client_id: 1, client_secret: ' 1', hr: 1}

        const action = authThunks.authorisedWithPassword.fulfilled(startState.userAuthData, "requestId", argData);
        const state = authReducer(startState, action);

        expect(state.userAuthData).toEqual(startState.userAuthData)
    })

    it('should return correct data after refresh token', () => {

        const action = authThunks.refreshToken.fulfilled(startState.userAuthData, "requestId",);
        const state = authReducer(startState, action);

        expect(state.userAuthData).toEqual(startState.userAuthData)

    })

})
