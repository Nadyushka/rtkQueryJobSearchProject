import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {AnyAction, combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'
import {ThunkDispatch} from 'redux-thunk'
import {authReducer} from "./authSlice/auth.slice";
import {vacanciesReducer} from "./vacanciesSlice/vacancies.slice";
import {selectedVacanciesReducer} from "./selectedVacanciesSlice/selectedVacancies.slice";

// store
const rootReducer = combineReducers({
    auth: authReducer,
    vacancies: vacanciesReducer,
    selectedVacancies: selectedVacanciesReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>  getDefaultMiddleware({serializableCheck: false}),
})

//custom hooks
export const useAppDispatch = () => useDispatch<AppThunkDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// types
export type AppDispatch = typeof store.dispatch
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>


//@ts-ignore
window.store = store