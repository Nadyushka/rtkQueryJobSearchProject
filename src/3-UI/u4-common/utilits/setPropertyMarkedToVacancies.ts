import {ResponseTypeVacancies} from "1-DAL/vacanciesAPI"
import {getDataFromLocalStorage} from "./localStorageData";

/**
 * Function set correct 'mark' value for each vacancy. 'mark': true - if vacancy was saved
 * @param vacanciesData = vacancies data recieved from server
 */

export const setPropertyMarkedToVacancies = (vacanciesData: ResponseTypeVacancies) => {
    let selectedVacancies = getDataFromLocalStorage()
    return {
        ...vacanciesData,
        objects: vacanciesData.objects.map(vacancy => selectedVacancies.includes(vacancy.id) ?
            {...vacancy, marked: true} :
            {...vacancy, marked: false})
    }
}