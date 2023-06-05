import {SelectedVacancyInfo, VacancyInfo} from "1-DAL/vacanciesAPI";
import {errorHandler} from "3-UI/u4-common/utilits/error";
import {AnyAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../3-UI/u4-common/utilits/create-app-async-thunk";
import axios from "axios";
import {ErrorType} from "../authSlice/auth.slice";

const initialState = {
    isLoading: false,
    error: '',
    vacanciesData: {
        "objects": [] as SelectedVacancyInfo[],
        "total": 0,
        "corrected_keyword": '',
        "more": false
    },
    currentPage: 1,
    pageCount: 4,
}

const setSelectedVacanciesData = createAppAsyncThunk<ReturnedValue, SetSelectedVacanciesDataArgumentsType>(
    "selectedVacancies/setSelectedVacanciesData",
    async ({currentPage, count}, {rejectWithValue}) => {
        try {
            const localStorageSelectedVacancies = localStorage.getItem('selectedVacancies') ? localStorage.getItem('selectedVacancies') : '{selectedVacanciesArray:[]}'
            const selectedItems: VacancyInfo[] = JSON.parse(localStorageSelectedVacancies!).selectedVacanciesArray
            return {objects: selectedItems, currentPage, count}
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const removeVacancyFromSelection = createAppAsyncThunk<ReturnedValue, RemoveVacancyFromSelectionArgumentsType>(
    "selectedVacancies/removeVacancyFromSelection",
    async ({id, currentPage, count}, {rejectWithValue, getState}) => {
        try {
            const selectedVacancies = getState().selectedVacancies.vacanciesData.objects.filter(v => v.id !== id)
            localStorage.removeItem('selectedVacancies')
            localStorage.setItem('selectedVacancies', JSON.stringify({selectedVacanciesArray: selectedVacancies}))
            return {objects: selectedVacancies, currentPage, count, id}
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const addVacancyToSelected = createAppAsyncThunk<ReturnedValue, addVacancyToSelectedArgumentsType>(
    "selectedVacancies/addVacancyToSelected",
    async ({id, profession, payment_from, currency, type_of_work, town}, {
        rejectWithValue,
        getState
    }) => {
        const selectedVacanciesSaved = getState().selectedVacancies.vacanciesData.objects
        const count = getState().selectedVacancies.pageCount
        const currentPage = 1

        try {
            const newVacancy = {
                id,
                profession,
                currency,
                payment_from,
                type_of_work: {title: type_of_work},
                town: {title: town},
                marked: true
            }
            const selectedVacancies: SelectedVacancyInfo[] = [newVacancy, ...selectedVacanciesSaved]
            localStorage.removeItem('selectedVacancies')
            localStorage.setItem('selectedVacancies', JSON.stringify({selectedVacanciesArray: selectedVacancies}))
            return {objects: selectedVacancies, currentPage, count, id}
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const slice = createSlice({
    name: "selectedVacancies",
    initialState,
    reducers: {
        isLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
            state.isLoading = action.payload.isLoading
        },
        setError: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setSelectedVacanciesData.fulfilled, (state, action) => {
            state.vacanciesData.objects = action.payload.objects
            state.vacanciesData.total = action.payload.objects.length
            state.currentPage = action.payload.currentPage
            state.pageCount = action.payload.count
        });
        builder.addCase(removeVacancyFromSelection.fulfilled, (state, action) => {
            state.vacanciesData.objects = action.payload.objects
            state.vacanciesData.total = action.payload.objects.length
            state.currentPage = action.payload.currentPage
            state.pageCount = action.payload.count
        });
        builder.addCase(addVacancyToSelected.fulfilled, (state, action) => {
            state.vacanciesData.objects = action.payload.objects
            state.vacanciesData.total = action.payload.objects.length
            state.currentPage = action.payload.currentPage
            state.pageCount = action.payload.count
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

export const selectedVacanciesReducer = slice.reducer;
export const selectedVacanciesActions = slice.actions;
export const selectedVacanciesThunks = {setSelectedVacanciesData, removeVacancyFromSelection, addVacancyToSelected};

// types

export type SelectedVacanciesInitialStateType = typeof initialState
type SetSelectedVacanciesDataArgumentsType = { currentPage: number, count: number }
type RemoveVacancyFromSelectionArgumentsType = { id: number, currentPage: number, count: number }
type addVacancyToSelectedArgumentsType = { id: number, profession: string, payment_from: number | "", currency: "rub" | "uah" | "uzs", type_of_work: string, town: string }
type ReturnedValue = { objects: SelectedVacancyInfo[], currentPage: number, count: number, id?: number }