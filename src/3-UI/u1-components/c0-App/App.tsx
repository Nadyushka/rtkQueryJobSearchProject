import React, {useEffect} from 'react';
import './App.css';
import {HeaderSimple} from "../c1-features/f1-header/Header";
import {RoutesComponent} from "../c2-commonComponents/routes/Routes";
import {authThunks} from "2-BLL/authSlice/auth.slice";
import {useAppDispatch} from "2-BLL/store";

export function App() {

    const dispatch = useAppDispatch()

    const appLinks = [
        {link: '/vacancySearch', label: 'Поиск Вакансий'},
        {link: '/selectedVacancies', label: 'Избранное'}]

    useEffect(() => {
            dispatch(authThunks.authorisedWithPassword({
                login: 'sergei.stralenia@gmail.com',
                password: 'paralect123',
                client_id: 2356,
                client_secret: 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948',
                hr: 0
            }))
        }
        , [])

    return (
        <div className="App">
            <HeaderSimple links={appLinks}/>
            <RoutesComponent/>
        </div>
    );
}

