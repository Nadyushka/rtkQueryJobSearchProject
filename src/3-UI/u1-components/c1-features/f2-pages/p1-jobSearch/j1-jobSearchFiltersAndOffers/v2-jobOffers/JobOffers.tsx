import React, {useEffect, useState} from 'react';
import {Search} from 'tabler-icons-react';
import {useStyles} from "./styleJobOffers";
import {Button, Container, Pagination, Text, TextInput} from '@mantine/core';
import {LoaderComponent} from "../../../../../c2-commonComponents/loader/Loader";
import {ErrorComponent} from "../../../../../c2-commonComponents/error/ErrorComponent";
import {VacancyItem} from "../../../../../c2-commonComponents/vacancyItem/VacancyItem";
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {vacanciesActions, vacanciesThunks} from "2-BLL/vacanciesSlice/vacancies.slice";
import {
    catalogueDataVacancies, currentPageVacancies,
    errorVacancies,
    isLoadingVacancies,
    jobAreaVacancies,
    keyWordVacancies,
    pageCountVacancies,
    paymentFromVacancies,
    paymentToVacancies,
    vacanciesDataVacancies
} from "2-BLL/vacanciesSlice/vacancies.selectors";
import {vacanciesDataSelectedVacancies} from "2-BLL/selectedVacanciesSlice/selectedVacancies.selectors";

export const JobOffers = () => {

    const dispatch = useAppDispatch()
    const vacancies = useAppSelector(vacanciesDataVacancies).objects
    const selectedVacancies = useAppSelector(vacanciesDataSelectedVacancies).objects
    const error = useAppSelector(errorVacancies)
    const isLoading = useAppSelector(isLoadingVacancies)
    const totalVacancies = useAppSelector(vacanciesDataVacancies).total
    const currentPage = useAppSelector(currentPageVacancies)
    const pagesCount = useAppSelector(pageCountVacancies)
    const paymentFrom = useAppSelector(paymentFromVacancies)
    const paymentTo = useAppSelector(paymentToVacancies)
    const jobArea = useAppSelector(jobAreaVacancies)
    const keyWord = useAppSelector(keyWordVacancies)
    const catalogues = useAppSelector(catalogueDataVacancies)

    const [activePage, setPage] = useState<number>(1);
    const maxVacancies = 500;
    const totalPages = totalVacancies  > maxVacancies  ? maxVacancies / pagesCount : totalVacancies / pagesCount
    const [keyWordValue, setKeyWordValue] = useState<string>(keyWord)

    const {classes, cx} = useStyles();

    const keyWordInputDataAttribute = {'data-elem': 'search-input'}
    const useKeyWordDataAttribute = {'data-elem': 'search-button'}

    const setKewWordHandler = () => {
        dispatch(vacanciesActions.setKeyWord({keyWord: keyWordValue}))
    }

    useEffect(() => {
        if (catalogues.length === 0) {
            dispatch(vacanciesThunks.setCatalogueData())
            dispatch(vacanciesThunks.setVacanciesData({currentPage: 1, count: pagesCount}))
        } else {
            dispatch(vacanciesThunks.setFiltredVacanciesData())
        }
        setKeyWordValue(keyWord)
        setPage(currentPage)
    }, [keyWord, currentPage, currentPage, paymentFrom, paymentTo, jobArea])


    return (
        <Container className={classes.jobSearchContainer}>
            {isLoading && <LoaderComponent/>}
            <TextInput className={classes.inputJobName}
                       value={keyWordValue}
                       onChange={(e) => {
                           setKeyWordValue(e.currentTarget.value)
                       }}
                       size={'lg'}
                       placeholder="Введите название вакансии"
                       icon={<Search size="1rem"/>}
                       rightSection={
                           <Button size="sm"
                                   disabled={isLoading}
                                   onClick={setKewWordHandler}{...useKeyWordDataAttribute}>
                               Поиск
                           </Button>}
                       {...keyWordInputDataAttribute}
            />
            {vacancies.length > 0 && vacancies.map(({
                                                        id,
                                                        profession,
                                                        payment_from,
                                                        currency,
                                                        type_of_work,
                                                        town,
                                                        marked
                                                    }) => {
                return (
                    <VacancyItem key={id} id={id} professionName={profession}
                                 payment_from={payment_from}
                                 currency={currency}
                                 type_of_work={type_of_work.title}
                                 town={town.title}
                                 marked={marked} showSelectedVacancy={false}/>
                )
            })}
            {vacancies.length > 0 &&
                <Pagination className={classes.jobSearchPagination}
                            value={activePage}
                            onChange={(value) => {
                                setPage(value)
                                dispatch(vacanciesActions.setPage({page: value}))
                            }}
                            total={totalPages}/>}

            {isLoading === false && vacancies.length === 0 &&
                <Text className={classes.jobSearchNotFound}>Упс, совпадений по заданному набору фильтров нет</Text>
            }

            <ErrorComponent errorMessage={error}/>

        </Container>
    );
};

