import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

const Feed = lazy(() => import('~/pages/Feed'));
const News = lazy(() => import('~/pages/News'));

export const Gates: React.FC = () => (
    <Suspense fallback={<LinearProgress />}>
        <Switch>
            <Redirect exact from="/" to="/feed" />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/news" component={News} />
        </Switch>
    </Suspense>
);
