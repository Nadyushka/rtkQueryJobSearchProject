import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './3-UI/u1-components/c0-App/App';
import reportWebVitals from './reportWebVitals';
import {Global, MantineProvider} from '@mantine/core';
import bold from '3-UI/u3-styles/fonts/OpenSans-Bold.ttf'
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./2-BLL/store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <MantineProvider theme={{colorScheme: 'light', fontFamily: 'Inter, sans-serif'}}>
            <Global
                styles={[
                    {
                        '@font-face': {
                            fontFamily: 'Open Sans',
                            src: `url('${bold}') format("ttf")`,
                            fontWeight: 700,
                            fontStyle: 'normal',
                        },
                    },
                ]}
            />
            <HashRouter>
                <App/>
            </HashRouter>
        </MantineProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
