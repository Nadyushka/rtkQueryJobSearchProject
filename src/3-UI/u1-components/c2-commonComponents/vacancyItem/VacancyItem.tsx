import React, {FC, memo, useEffect} from 'react';
import {MouseEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Container, Text, Title} from "@mantine/core";
import selectedStar from '3-UI/u2-assets/pictures/selectedStar.svg'
import notSelectedStar from '3-UI/u2-assets/pictures/notSelectedStar.svg'
import locationIcon from '3-UI/u2-assets/pictures/locationIcon.svg'
import {selectedVacanciesThunks} from "2-BLL/selectedVacanciesSlice/selectedVacancies.slice";
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {
    currentPageSelectedVacancies,
    pageCountSelectedVacancies
} from "2-BLL/selectedVacanciesSlice/selectedVacancies.selectors";
import {useStyles} from "./styleVacancyItem";
import {LoaderComponent} from "../loader/Loader";
import {isLoadingVacancies} from "../../../../2-BLL/vacanciesSlice/vacancies.selectors";

type PropsType = {
    id: number
    professionName: string
    payment_from: number | ""
    type_of_work: string
    town: string
    marked: boolean,
    showSelectedVacancy: boolean
    currency: 'rub' | 'uah' | 'uzs'
}

export const VacancyItem: FC<PropsType> = memo(({
                                                    id, professionName,
                                                    payment_from,
                                                    currency,
                                                    type_of_work,
                                                    town,
                                                    marked,
                                                }) => {

        const dispatch = useAppDispatch()
        const currentPage = useAppSelector(currentPageSelectedVacancies)
        const count = useAppSelector(pageCountSelectedVacancies)

        const navigate = useNavigate()

        const onClickVacancyHandler = () => navigate(`/selectedVacancy/${id}`);

        const toggleSelectVacancies = (e: MouseEvent<HTMLImageElement>) => {
            e.stopPropagation();
            if (marked) {
                dispatch(selectedVacanciesThunks.removeVacancyFromSelection({id, currentPage, count}))
            }
            if (!marked) {
                dispatch(selectedVacanciesThunks.addVacancyToSelected({
                    id,
                    profession: professionName,
                    payment_from,
                    currency,
                    type_of_work,
                    town
                }))
            }

        }

        const {classes, cx} = useStyles();

        const vacancyIdDataAttribute = {'data-elem': `vacancy-${id}`}


        return (
            <Container className={classes.vacancyItemContainer} onClick={onClickVacancyHandler} {...vacancyIdDataAttribute}>
                <Box className={classes.vacancyItemInfo}>
                    <Title className={classes.vacancyItemContainerTitle} order={3}>{professionName}</Title>
                    <img className={classes.vacancyItemSelectImg}
                         src={marked ? selectedStar : notSelectedStar}
                         onClick={toggleSelectVacancies}
                         data-elem={`vacancy-${id}-shortlist-button`}
                    />
                </Box>
                <Text className={classes.vacancyItemDescription} span>
                    {payment_from !== 0 ? `з/п от ${payment_from} ${currency}` : 'з/п не указана'}
                    <div/>
                    <Text span>{type_of_work}</Text>
                </Text>
                <Box className={classes.vacancyItemInfoPlace}>
                    <img src={locationIcon}/>
                    <Text>{town}</Text>
                </Box>
            </Container>
        );
    }
)


