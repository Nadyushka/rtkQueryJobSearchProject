import React, {useEffect, useState} from 'react';
import {Search} from 'tabler-icons-react';
import {useStyles} from "./styleJobOffers";
import {Button, Container, Pagination, Text, TextInput} from '@mantine/core';
import {LoaderComponent} from "../../../../../c2-commonComponents/loader/Loader";
import {ErrorComponent} from "../../../../../c2-commonComponents/error/ErrorComponent";
import {VacancyItem} from "../../../../../c2-commonComponents/vacancyItem/VacancyItem";
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {vacanciesActions} from "2-BLL/vacanciesSlice/vacancies.slice";
import {
    currentPageVacancies,
    jobAreaVacancies,
    keyWordVacancies,
    pageCountVacancies,
    paymentFromVacancies,
    paymentToVacancies,
    vacanciesDataVacancies
} from "2-BLL/vacanciesSlice/vacancies.selectors";
import {useLazyGetVacanciesQuery} from '2-BLL/vacanciesSlice/service/vacancies.slice';
import {VacancyInfo} from "../../../../../../../2-BLL/vacanciesSlice/service/vacancies.types";


export const JobOffers = () => {

    const [setVacancies, {data, isLoading, error}] = useLazyGetVacanciesQuery()

    const dispatch = useAppDispatch()
    const [vacanciesData, setVacanciesData] = useState<VacancyInfo[] | []>([])
    const totalVacancies = data ? data.total : 0
    const currentPage = useAppSelector(currentPageVacancies)
    const pagesCount = useAppSelector(pageCountVacancies)
    const payment_from = useAppSelector(paymentFromVacancies)
    const payment_to = useAppSelector(paymentToVacancies)
    const jobArea = useAppSelector(jobAreaVacancies)
    const keyword = useAppSelector(keyWordVacancies)
    const catalogues = useAppSelector(state => state.vacancies.catalogueData)
    const access_token = useAppSelector(state => state.auth.userAuthData.access_token)

    let catalogueID = catalogues.find(c => c.title_rus === jobArea) ?
        catalogues.find(c => c.title_rus === jobArea)!.key.toString() : ''

    console.log(catalogues)

    const [activePage, setPage] = useState<number>(1);
    const maxVacancies = 500;
    const totalPages = totalVacancies > maxVacancies ? maxVacancies / pagesCount : totalVacancies / pagesCount
    const [keyWordValue, setKeyWordValue] = useState<string>(keyword)

    const {classes, cx} = useStyles();

    const setKewWordHandler = () => {
        dispatch(vacanciesActions.setKeyWord({keyWord: keyWordValue}))
    }

    useEffect(() => {
        if (access_token) {
            setVacancies({page: activePage, count: pagesCount, keyword, payment_from, payment_to, catalogues: catalogueID})
                .then(res => {
                    setVacanciesData(res!.data!.objects!)
                })
        }
        setKeyWordValue(keyword)
        setPage(currentPage)
    }, [access_token, keyword, currentPage, currentPage, payment_from, payment_to, jobArea])

    let errorMessageText: string = ''
    if (error && 'status' in error!) {
        errorMessageText = 'error' in error ? error.error : JSON.stringify(error.data)
    }

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
                                   onClick={setKewWordHandler}>
                               Поиск
                           </Button>}
            />
            {vacanciesData.map(({
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
            {vacanciesData.length > 0 &&
                <Pagination className={classes.jobSearchPagination}
                            value={activePage}
                            onChange={(value) => {
                                setPage(value)
                                dispatch(vacanciesActions.setPage({page: value}))
                            }}
                            total={totalPages}/>}

            {isLoading === false && vacanciesData.length === 0 &&
                <Text className={classes.jobSearchNotFound}>Упс, совпадений по заданному набору фильтров нет</Text>
            }

            <ErrorComponent errorMessage={errorMessageText}/>

        </Container>
    );
};

