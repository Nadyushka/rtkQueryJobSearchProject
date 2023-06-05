import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Container, Pagination} from '@mantine/core';
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {
    selectedVacanciesThunks
} from "2-BLL/selectedVacanciesSlice/selectedVacancies.slice";
import {
    currentPageSelectedVacancies,
    errorSelectedVacancies,
    isLoadingSelectedVacancies, pageCountSelectedVacancies, vacanciesDataSelectedVacancies
} from "2-BLL/selectedVacanciesSlice/selectedVacancies.selectors";
import {VacancyItem} from "../../../../c2-commonComponents/vacancyItem/VacancyItem";
import {PATH} from "../../../../c2-commonComponents/routes/Routes";
import {LoaderComponent} from "../../../../c2-commonComponents/loader/Loader";
import {ErrorComponent} from "../../../../c2-commonComponents/error/ErrorComponent";
import {useStyles} from './styleSavedVacancies';

export const SavedVacancies = () => {

    const dispatch = useAppDispatch()
    const isLoading = useAppSelector(isLoadingSelectedVacancies)
    const error = useAppSelector(errorSelectedVacancies)
    const selectedVacancies = useAppSelector(vacanciesDataSelectedVacancies).objects
    const totalVacancies = useAppSelector(vacanciesDataSelectedVacancies).total
    const pageCount = useAppSelector(pageCountSelectedVacancies)
    const currentPage = useAppSelector(currentPageSelectedVacancies)

    const navigate = useNavigate()

    const {classes, cx} = useStyles();

    let totalPages = Math.ceil(totalVacancies / pageCount)
    const [activePage, setPage] = useState<number>(currentPage);

    let regularFirstPage = activePage * pageCount - pageCount;
    let notEnoughValuesFirstPage = activePage * pageCount - 2 * pageCount
    let firstValueOfCurrentPage = activePage > totalPages ? notEnoughValuesFirstPage : regularFirstPage
    let lastValueOfCurrentPage = firstValueOfCurrentPage + pageCount

    useEffect(() => {
        if (selectedVacancies.length === 0) {
            navigate(PATH.NO_SELECTED_VACANCIES)
        }
        dispatch(selectedVacanciesThunks.setSelectedVacanciesData({currentPage: 1, count: 4}))
    }, [selectedVacancies.length])

    if (isLoading) {
        return <LoaderComponent/>
    }

    return (
        <Container className={classes.selectedVacancyContainer}>
            {selectedVacancies.slice(firstValueOfCurrentPage, lastValueOfCurrentPage).map(({
                                                                                               id,
                                                                                               profession,
                                                                                               currency,
                                                                                               payment_from,
                                                                                               type_of_work,
                                                                                               town,
                                                                                               marked
                                                                                           }) => {
                return (
                    <VacancyItem key={id} id={id} professionName={profession} currency={currency}
                                 payment_from={payment_from} type_of_work={type_of_work.title} town={town.title}
                                 showSelectedVacancy={true} marked={marked}/>
                )
            })}
            <Pagination className={classes.jobSearchPagination}
                        value={activePage}
                        onChange={setPage}
                        total={totalPages}
            />

            <ErrorComponent errorMessage={error}/>

        </Container>
    );
};
