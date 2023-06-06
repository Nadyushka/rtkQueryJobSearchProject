import React from 'react';
import {useParams} from "react-router-dom";
import {Container, TypographyStylesProvider} from "@mantine/core";
import {LoaderComponent} from "../../../c2-commonComponents/loader/Loader";
import {ErrorComponent} from "../../../c2-commonComponents/error/ErrorComponent";
import {VacancyItem} from "../../../c2-commonComponents/vacancyItem/VacancyItem";
import {useStyles} from "./styleVacancy";
import {useGetVacancyQuery} from '2-BLL/vacanciesSlice/service/vacancies.slice';
import {useAppSelector} from "2-BLL/store";


export const Vacancy = () => {

    const {classes, cx} = useStyles();

    const selectedVacanciesId = useAppSelector(state => state.selectedVacancies.vacanciesData).objects.map(v => v.id)

    const params = useParams<{ id: string }>()
    const id = params.id!;
    const {data, isLoading, isFetching, error, isSuccess} = useGetVacancyQuery(id)

    let errorMessageText: string = ''
    if (error && 'status' in error!) {
        errorMessageText = 'error' in error ? error.error : JSON.stringify(error.data)
    }

    let markedProperty = false

    if (isSuccess) markedProperty = selectedVacanciesId.includes(data!.id)


    if (isLoading || isFetching) {
        return <LoaderComponent/>
    }

    return (
        <Container className={classes.vacancyContainer}>
            {data && <>
                <VacancyItem id={data!.id} professionName={data!.profession} payment_from={data!.payment_from}
                             currency={data!.currency} type_of_work={data!.type_of_work.title} town={data!.town.title}
                             marked={markedProperty}
                             showSelectedVacancy={true}/>
                <TypographyStylesProvider className={classes.vacancyInfo}>
                    <div dangerouslySetInnerHTML={{__html: data!.vacancyRichText}}/>
                </TypographyStylesProvider>
            </>
            }
            <ErrorComponent errorMessage={errorMessageText}/>
        </Container>
    );
};

