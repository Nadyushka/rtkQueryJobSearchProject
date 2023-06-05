import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {Container, TypographyStylesProvider} from "@mantine/core";
import {vacanciesThunks} from "2-BLL/vacanciesSlice/vacancies.slice";
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {errorVacancies, isLoadingVacancies, vacancyDataVacancies} from "2-BLL/vacanciesSlice/vacancies.selectors";
import {LoaderComponent} from "../../../c2-commonComponents/loader/Loader";
import {ErrorComponent} from "../../../c2-commonComponents/error/ErrorComponent";
import {VacancyItem} from "../../../c2-commonComponents/vacancyItem/VacancyItem";
import {useStyles} from "./styleVacancy";


export const Vacancy = () => {

    const dispatch = useAppDispatch()

    const {
        id,
        profession,
        payment_from,
        currency,
        marked,
        type_of_work,
        town,
        vacancyRichText
    } = useAppSelector(vacancyDataVacancies)
    const isLoading = useAppSelector(isLoadingVacancies)
    const error = useAppSelector(errorVacancies)

    const params = useParams<{ id: string }>()

    const {classes, cx} = useStyles();

    useEffect(() => {
        dispatch(vacanciesThunks.setVacancyData({id: +params.id!}))
    }, [params.id])

    if (isLoading) {
        return <LoaderComponent/>
    }

    return (
        <Container className={classes.vacancyContainer}>
            <VacancyItem id={id} professionName={profession} payment_from={payment_from}
                         currency={currency} type_of_work={type_of_work.title} town={town.title}
                         marked={marked}
                         showSelectedVacancy={true}/>
            <TypographyStylesProvider className={classes.vacancyInfo}>
                <div dangerouslySetInnerHTML={{__html: vacancyRichText}}/>
            </TypographyStylesProvider>

            <ErrorComponent errorMessage={error}/>
        </Container>
    );
};

