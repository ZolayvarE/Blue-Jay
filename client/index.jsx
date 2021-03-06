import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import requireAuth from './utils/auth.jsx';
import App from './components/App.jsx';
import Home from './pages/Home.jsx';
import StreamRoom from './pages/StreamRoom.jsx';
import CreateStream from './pages/CreateStream.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserSignUp from './pages/UserSignUp.jsx';
import Login from './pages/Login.jsx';
import configureStore from './store/storeConfig.jsx';
import Search from './pages/Search.jsx';
import Subscriptions from './pages/Subscriptions.jsx';
import Streams from './pages/Streams.jsx';
import Profile from './pages/Profile.jsx';
import JwtPage from './pages/JwtPage.jsx';
import NoMedia from './pages/NoMedia.jsx';
import StreamUnavailable from './pages/StreamUnavailable.jsx';

const store = configureStore();
persistStore(store);

render((
  <Provider store={store}>
    <Router history={browserHistory}> 
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='dashboard' component={Dashboard} onEnter={requireAuth} />
        <Route path='search' component={Search} />
        <Route path='subscriptions' component={Subscriptions} onEnter={requireAuth} />
        <Route path='streams' component={Streams} onEnter={requireAuth} />
        <Route path='create' component={CreateStream} onEnter={requireAuth} />
        <Route path='login' component={Login} />
        <Route path='signup' component={UserSignUp} />
        <Route path='nostream' component={StreamUnavailable} />
        <Route path='nomedia' component={NoMedia} />
        <Route path='jwt/:token' component={JwtPage} />
        <Route path=':creatorName/:streamSlug' component={StreamRoom} onEnter={requireAuth} />
      </Route>
    </Router>
  </Provider>
  ), document.getElementById('App'));
