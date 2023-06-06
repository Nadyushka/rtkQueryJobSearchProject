export type ResponseTypeCatalogues = {
    title_rus: string,
    key: number,
}

export type ResponseTypeVacancies = {
    "objects": VacancyInfo[],
    "total": number,
    "corrected_keyword": string,
    "more": boolean,
}

export type VacanciesParams = { page: number, count: number, keyword?: string, payment_from?: number | '', payment_to?: number | '', catalogues?: string }

export type VacancyInfo = {
    "id": number,
    "payment_from": number | '',
    "payment_to": number | '',
    "profession": string,
    "currency": 'rub' | 'uah' | 'uzs',
    "type_of_work": {
        "id": number,
        "title": string,
    },
    "town": {
        "id": number,
        "title": string,
        "declension": string,
        "genitive": string
    },
    "firm_name": string,
    vacancyRichText: string,
    marked: boolean
}