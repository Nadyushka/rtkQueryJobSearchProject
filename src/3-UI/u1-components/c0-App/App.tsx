import React, {useEffect} from 'react';
import './App.css';
import {HeaderSimple} from "../c1-features/f1-header/Header";
import {RoutesComponent} from "../c2-commonComponents/routes/Routes";
import {useLazyAuthoriseWithPasswordQuery, useLazyRefreshTokenQuery} from '2-BLL/authSlice/service/auth.slice';
import {useAppDispatch, useAppSelector} from "../../../2-BLL/store";
import {authActions} from "../../../2-BLL/authSlice/auth.slice";
import {ResponseTypeAuth} from "../../../2-BLL/authSlice/service/auth.types";

export function App() {

    const dispatch = useAppDispatch()

    const appLinks = [
        {link: '/vacancySearch', label: 'Поиск Вакансий'},
        {link: '/selectedVacancies', label: 'Избранное'}]

    const ttl = useAppSelector(state => state.auth.userAuthData.ttl)
    const refresh_token = useAppSelector(state => state.auth.userAuthData.refresh_token)

    const [authoriseWithPassword,{data}] = useLazyAuthoriseWithPasswordQuery()
    const [refreshToken, {data: RefreshTokenData}] = useLazyRefreshTokenQuery()

    // if (authoriseIsSuccess) {
    //     dispatch (authActions.setAuthorisedData({
    //         access_token: data.access_token,
    //         refresh_token: data.refresh_token,
    //         ttl: data.ttl
    //     }))
    // }

    useEffect(()=>{
        authoriseWithPassword({
            login: 'sergei.stralenia@gmail.com',
            password: 'paralect123',
            client_id: 2356,
            client_secret: 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948',
            hr: 0
        }).then((res )=>{
            dispatch (authActions.setAuthorisedData({
                access_token: res.data!.access_token,
                refresh_token: res.data!.refresh_token,
                ttl: res.data!.ttl
            }))
        })
    }, [])

    // if (ttl && ttl < Date.now()) {
    //     refreshToken(refresh_token)
    //         .then((res) => {
    //             authActions.setAuthorisedData({
    //                 access_token: RefreshTokenData!.access_token,
    //                 refresh_token: RefreshTokenData!.refresh_token,
    //                 ttl: RefreshTokenData!.ttl
    //             })
    //         })
    // }


    return (
        <div className="App">
            <HeaderSimple links={appLinks}/>
            <RoutesComponent/>
        </div>
    );
}

