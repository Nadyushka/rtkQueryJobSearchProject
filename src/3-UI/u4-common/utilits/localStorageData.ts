import {SelectedVacancyInfo} from "1-DAL/vacanciesAPI";

/**
 * function checks, if there is any data (saved vacancies) on local storage and create an array with saved vacancies IDs
 */

export const getDataFromLocalStorage = (): number[] => {
    const selectedVacanciesLS = localStorage.getItem('selectedVacancies')
    if (selectedVacanciesLS) {
        return JSON.parse(localStorage.getItem('selectedVacancies')!).selectedVacanciesArray.map((v: SelectedVacancyInfo) => v.id)
    } else {
        return []
    }
}