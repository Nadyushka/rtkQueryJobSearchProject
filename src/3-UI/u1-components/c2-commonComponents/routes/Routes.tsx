import {Route, Routes} from "react-router-dom";
import {Container} from "@mantine/core";
import {JobSearch} from "../../c1-features/f2-pages/p1-jobSearch/JobSearch";
import {Vacancy} from "../../c1-features/f2-pages/p2-vacancy/Vacancy";
import {SavedVacancies} from "../../c1-features/f2-pages/p3-saved/s1-savedVacancy/SavedVacancies";
import {NoSavedVacancies} from "../../c1-features/f2-pages/p3-saved/s2-noSavedVacancies/NoSavedVacancies";
import {useStyles} from "./styleRoutes";

export const PATH = {
    VACANCY_SEARCH: '/vacancySearch',
    ACTIVE_VACANCY: '/selectedVacancy/:id',
    SELECTED_VACANCIES: '/selectedVacancies',
    NO_SELECTED_VACANCIES: '/selectedVacancies/noSelectedVacancies',
}

export const RoutesComponent = () => {

    const {classes, cx} = useStyles();

    return (
        <Container className={classes.bodyContainer}>
            <Routes>
                <Route path={'/'} element={<JobSearch/>}/>
                <Route path={PATH.VACANCY_SEARCH} element={<JobSearch/>}/>
                <Route path={PATH.ACTIVE_VACANCY} element={<Vacancy/>}/>
                <Route path={PATH.SELECTED_VACANCIES} element={<SavedVacancies/>}/>
                <Route path={PATH.NO_SELECTED_VACANCIES} element={<NoSavedVacancies/>}/>
            </Routes>
        </Container>
    )
}

