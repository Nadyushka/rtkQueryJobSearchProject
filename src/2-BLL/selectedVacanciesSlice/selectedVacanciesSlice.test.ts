import {
    selectedVacanciesActions,
    SelectedVacanciesInitialStateType,
    selectedVacanciesReducer, selectedVacanciesThunks,
} from "./selectedVacancies.slice";
import { SelectedVacancyInfo} from "1-DAL/vacanciesAPI";


describe('selectedVacanciesReducers actions test', () => {

    let startState: SelectedVacanciesInitialStateType;
    const selectedVacanciesData = [{
            id: 1,
            payment_from: 150000,
            profession: 'Frontend developer',
            currency: "rub",
            type_of_work: {title: 'remote'},
            town: {title: 'Minsk'},
            marked: false
        },
            {
                id: 11,
                payment_from: 150000,
                profession: 'Manager',
                currency: "rub",
                type_of_work: {title: 'remote'},
                town: {title: 'Minsk'},
                marked: false
            }] as SelectedVacancyInfo[]

    beforeEach(() => {
        startState = {
            isLoading: false,
            error: '',
            vacanciesData: {
                "objects": [] as SelectedVacancyInfo[],
                "total": 0,
                "corrected_keyword": '',
                "more": false
            },
            currentPage: 1,
            pageCount: 3,
        }
    })

    it('should set correct error', () => {
        const endState = selectedVacanciesReducer(startState, selectedVacanciesActions.setError({error:'some error'}))
        expect(endState.error).toBe('some error')
    })

    it('should return correct selected vacancies', () => {

        const returnedValue = { objects: selectedVacanciesData, currentPage: 1, count: 3 }
        const argData = {currentPage: 1, count: 3 }

        const action = selectedVacanciesThunks.setSelectedVacanciesData.fulfilled(returnedValue, "requestId", argData);
        const state = selectedVacanciesReducer(startState, action);

        expect(state.vacanciesData.objects).toEqual(returnedValue.objects)
        expect(state.currentPage).toBe(1)
        expect(state.pageCount).toBe(3)
    })

})
