import {AnyAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ResponseTypeCatalogues, VacancyInfo} from "1-DAL/vacanciesAPI";

const initialState = {
    isLoading: false,
    error: '',
    catalogueData: [] as ResponseTypeCatalogues[],
    vacanciesData: {
        "objects": [] as VacancyInfo[],
        "total": 0,
        "corrected_keyword": '',
        "more": false
    },
    vacancyData: {
        "id": 0,
        "payment_from": '',
        "payment_to": '',
        "profession": '',
        "currency": 'rub',
        "type_of_work": {
            "id": 0,
            "title": '',
        },
        "town": {
            "id": 0,
            "title": '',
            "declension": '',
            "genitive": '',
        },
        "firm_name": '',
        "vacancyRichText": '',
    } as VacancyInfo,
    currentPage: 1,
    pageCount: 4,
    payment_from: '' as number | '',
    payment_to: '' as number | '',
    jobArea: '',
    keyWord: '',
}

const slice = createSlice({
    name: "vacancies",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<{ page: number }>) => {
            state.currentPage = action.payload.page
        },
        setCatalogueData: (state, action: PayloadAction<{ data: ResponseTypeCatalogues[] }>) => {
            state.catalogueData = action.payload.data
        },
        setKeyWord: (state, action: PayloadAction<{ keyWord: '' | string }>) => {
            state.keyWord = action.payload.keyWord
            state.currentPage = 1
        },
        setFilters: (state, action: PayloadAction<{ payment_from: number | '', payment_to: number | '', catalogues: string | '' }>) => {
            state.payment_from = action.payload.payment_from
            state.payment_to = action.payload.payment_to
            state.jobArea = action.payload.catalogues
            state.currentPage = 1
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher((action: AnyAction) => {
            return action.type.endsWith('/pending')
        }, (state, action) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addMatcher((action: AnyAction) => {
            return action.type.endsWith('/fulfilled')
        }, (state, action) => {
            state.isLoading = false
        })
    },
})

export const vacanciesReducer = slice.reducer;
export const vacanciesActions = slice.actions;

// types

export type VacanciesInitialStateType = typeof initialState
