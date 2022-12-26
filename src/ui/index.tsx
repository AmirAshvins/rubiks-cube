import React, {useMemo} from 'react';
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {History} from '@remix-run/router';
import ApplicationViews from "./views";
import EnvService from "../core/services/env-service";


const Application = () => {
    const history = useMemo(() => createBrowserHistory() as unknown as History, [])

    return (
        <HistoryRouter basename={EnvService.PublicUrl} history={history}>
            <ApplicationViews/>
        </HistoryRouter>
    );
}

export default Application;
