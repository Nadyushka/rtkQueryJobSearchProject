import {AnyAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {
    ResponseTypeCatalogues,
    ResponseTypeVacancies,
    vacancyApi,
    VacancyInfo
} from "1-DAL/vacanciesAPI";
import {ErrorType} from "2-BLL/authSlice/auth.slice";
import {getDataFromLocalStorage} from "3-UI/u4-common/utilits/localStorageData";
import {setPropertyMarkedToVacancies} from "3-UI/u4-common/utilits/setPropertyMarkedToVacancies";
import {createAppAsyncThunk} from "3-UI/u4-common/utilits/create-app-async-thunk";
import {checkTokenValidity} from "3-UI/u4-common/utilits/checkTokenValidity";
import {selectedVacanciesThunks} from "../selectedVacanciesSlice/selectedVacancies.slice";

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

const setCatalogueData = createAppAsyncThunk<ResponseTypeCatalogues[]>(
    "vacancies/setCatalogueData",
    async (arg, {rejectWithValue}) => {
        try {
            let res = await vacancyApi.getCatalogues()
            return res.data
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const setVacanciesData = createAppAsyncThunk<ResponseTypeVacancies, SetVacanciesDataArgsType>(
    "vacancies/setVacanciesData",
    async ({currentPage, count}, {dispatch, rejectWithValue, getState}) => {

        const token = getState().auth.userAuthData.access_token
        let ttl = getState().auth.userAuthData.ttl
        checkTokenValidity(ttl, dispatch)

        try {
            const res = await vacancyApi.getVacancies(token, {page: currentPage, count})
            const vacancies = setPropertyMarkedToVacancies(res.data)
            return vacancies
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const setFiltredVacanciesData = createAppAsyncThunk<ResponseTypeVacancies>(
    "vacancies/setFiltredVacanciesData",
    async (_, {
        dispatch,
        rejectWithValue,
        getState
    }) => {

        const token = getState().auth.userAuthData.access_token
        const {keyWord, currentPage, pageCount: count, payment_from, payment_to, jobArea} = getState().vacancies
        const catalogueData = getState().vacancies.catalogueData
        const catalogueID = catalogueData.find(c => c.title_rus === jobArea) ?
            catalogueData.find(c => c.title_rus === jobArea)!.key.toString() : ''

        try {
            let res = await vacancyApi.getFiltredVacancies(token, {
                page: currentPage,
                count,
                published: 1,
                keyword: keyWord,
                payment_from,
                payment_to,
                catalogues: catalogueID
            })
            let vacancies = setPropertyMarkedToVacancies(res.data)
            return vacancies
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const setVacancyData = createAppAsyncThunk<VacancyInfo, SetVacancyDataArgsType>(
    "vacancies/setVacancyData",
    async ({id}, {dispatch, rejectWithValue, getState}) => {
        const token = getState().auth.userAuthData.access_token
        try {
            let res = await vacancyApi.getVacancy(id, token)
            let selectedVacancies = getDataFromLocalStorage()
            let vacancies = {...res.data, marked: selectedVacancies.includes(res.data.id)}
            return vacancies
        } catch (error) {
            return rejectWithValue({error})
        }
    }
);

const slice = createSlice({
    name: "vacancies",
    initialState,
    reducers: {
        isLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
            state.isLoading = action.payload.isLoading
        },
        setError: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error
        },
        setPage: (state, action: PayloadAction<{ page: number }>) => {
            state.currentPage = action.payload.page
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
        builder.addCase(setCatalogueData.fulfilled, (state, action) => {
            state.catalogueData = action.payload
        });
        builder.addCase(setVacanciesData.fulfilled, (state, action) => {
            state.vacanciesData = action.payload;
        });

        builder.addCase(setFiltredVacanciesData.fulfilled, (state, action) => {
            state.vacanciesData = action.payload;
        });
        builder.addCase(setVacancyData.fulfilled, (state, action) => {
            state.vacancyData = action.payload;
        });
        builder.addCase(selectedVacanciesThunks.removeVacancyFromSelection.fulfilled, (state, action) => {
            if (state.vacanciesData.objects.length !== 0) {
                let index = state.vacanciesData.objects.findIndex(vacancy => vacancy.id === action.payload.id)
                state.vacanciesData.objects[index].marked = false
            }
            if (state.vacancyData.id !== 0) {
                state.vacancyData.marked = false
            }
        });
        builder.addCase(selectedVacanciesThunks.addVacancyToSelected.fulfilled, (state, action) => {
            if (state.vacanciesData.objects.length !== 0) {
                let index = state.vacanciesData.objects.findIndex(vacancy => vacancy.id === action.payload.id)
                state.vacanciesData.objects[index].marked = true
            }
            if (state.vacancyData.id !== 0) {
                state.vacancyData.marked = true
            }
        });
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
    },
})

export const vacanciesReducer = slice.reducer;
export const vacanciesActions = slice.actions;
export const vacanciesThunks = {setCatalogueData, setVacanciesData, setFiltredVacanciesData, setVacancyData};

// types

export type VacanciesInitialStateType = typeof initialState
type SetVacanciesDataArgsType = { currentPage: number, count: number }
type SetVacancyDataArgsType = { id: number }