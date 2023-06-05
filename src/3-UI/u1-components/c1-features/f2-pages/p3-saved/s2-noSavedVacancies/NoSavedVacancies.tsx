import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Image, rem, Text} from "@mantine/core";
import noVacanciesFoundImg from '3-UI/u2-assets/pictures/noVacanciesFoundIcon.svg'
import {PATH} from "../../../../c2-commonComponents/routes/Routes";
import {useStyles} from "./styleNoSavedVacancies";
import {LoaderComponent} from "../../../../c2-commonComponents/loader/Loader";
import {useAppSelector} from "2-BLL/store";
import {isLoadingSelectedVacancies} from "2-BLL/selectedVacanciesSlice/selectedVacancies.selectors";

export const NoSavedVacancies = () => {

    const isLoading = useAppSelector(isLoadingSelectedVacancies)

    const navigate = useNavigate()

    const {classes, cx} = useStyles();

    const searchMoreVacanciesHandler = () => navigate(PATH.VACANCY_SEARCH)

    if (isLoading) {
        return <LoaderComponent/>
    }

    return (
        <Container className={classes.noSelectedVacancyContainer}>
            <Image className={classes.noSelectedVacancyImg} src={noVacanciesFoundImg} width={'240px'}
                   height={'230.27px'}/>
            <Text className={classes.noSelectedVacancyText}>Упс, здесь еще ничего нет!</Text>
            <Button sx={{fontFamily: 'Open Sans, sans-serif',}}
                    className={classes.noSelectedVacancyButton}
                    onClick={searchMoreVacanciesHandler}>
                Поиск Вакансий
            </Button>
        </Container>
    );
};


