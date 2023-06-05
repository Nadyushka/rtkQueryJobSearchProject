import {ResponseTypeCatalogues, ResponseTypeVacancies, VacancyInfo} from "1-DAL/vacanciesAPI";
import {vacanciesActions, VacanciesInitialStateType, vacanciesReducer, vacanciesThunks} from "./vacancies.slice";

describe('vacanciesReducers actions test', () => {

    let startState: VacanciesInitialStateType;
    const vacanciesData: ResponseTypeVacancies = {
        objects: [{
            id: 1,
            payment_from: 150000,
            payment_to: 200000,
            profession: 'Frontend developer',
            currency: "rub",
            type_of_work: {id: 1, title: 'remote'},
            town: {id: 2, title: 'Minsk', declension: '', genitive: ''},
            firm_name: '',
            vacancyRichText: '',
            marked: false
        },
            {
                id: 11,
                payment_from: 150000,
                payment_to: 200000,
                profession: 'Manager',
                currency: "rub",
                type_of_work: {id: 1, title: 'remote'},
                town: {id: 2, title: 'Minsk', declension: '', genitive: ''},
                firm_name: '',
                vacancyRichText: '',
                marked: false
            }],
        total: 255,
        corrected_keyword: '',
        more: false,
    }

    beforeEach(() => {
        startState = {
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
            pageCount: 3,
            payment_from: '' as number | '',
            payment_to: '' as number | '',
            jobArea: '',
            keyWord: '',
        }
    })

    it('should set correct loading status', () => {
        const endState = vacanciesReducer(startState, vacanciesActions.isLoading({isLoading: true}))
        expect(endState.isLoading).toBeTruthy()
        expect(endState.error).toBe('')
    })

    it('should set correct error', () => {
        const endState = vacanciesReducer(startState, vacanciesActions.setError({error: 'some error'}))
        expect(endState.error).toBe('some error')
    })

    it('should set correct filters data', () => {
        const endState = vacanciesReducer(startState, vacanciesActions.setFilters({
            payment_from: 50000,
            payment_to: 100000,
            catalogues: 'IT'
        }))
        expect(endState.keyWord).toBe('Manager')
        expect(endState.payment_from).toBe(50000)
        expect(endState.payment_to).toBe(100000)
    })

    it('should return correct catalogues data', () => {
        const returnedValue = [{title_rus: 'IT', key: 1}]

        const action = vacanciesThunks.setCatalogueData.fulfilled(returnedValue, "requestId");
        const state = vacanciesReducer(startState, action);

        expect(state.catalogueData).toEqual(returnedValue)
        expect(state.currentPage).toBe(1)
        expect(state.pageCount).toBe(3)
    })

    it('should return correct vacancies data', () => {
        const args = {currentPage: 1, count: 3}

        const action = vacanciesThunks.setVacanciesData.fulfilled(vacanciesData, "requestId", args);
        const state = vacanciesReducer(startState, action);

        expect(state.vacanciesData).toEqual(vacanciesData)
    })

    it('should return correct filtred vacancies data', () => {
        const args = {page: 1 }

        const action = vacanciesThunks.setFiltredVacanciesData.fulfilled(vacanciesData, "requestId", );
        const state = vacanciesReducer(startState, action);

        expect(state.vacanciesData).toEqual(vacanciesData)
    })

    it('should return correct vacancy data', () => {
        const args = {id: 1}

        const action = vacanciesThunks.setVacancyData.fulfilled(startState.vacancyData, "requestId", args);
        const state = vacanciesReducer(startState, action);

        expect(state.vacancyData).toEqual(startState.vacancyData)
    })

})
