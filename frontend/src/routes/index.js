import React from 'react';
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom';

import SignInPage from '../pages/public/SignIn';
import SignUpPage from '../pages/public/SignUp';
import DashboardPage from '../pages/secure/Dashboard';

import ContactsListPage from '../pages/secure/ContactsList';
import ContactAddPage from '../pages/secure/ContactAdd';
import ContactDetailPage from '../pages/secure/ContactDetail';
import MessagesListPage from '../pages/secure/MessagesList';
import MessageAddPage from '../pages/secure/MessageAdd';
import MessageDetailPage from '../pages/secure/MessageDetail';

import RoutePrivate from './route-wrapper';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <RoutePrivate exact path="/" component={DashboardPage} />
        <RoutePrivate exact path="/contacts" component={ContactsListPage} />
        <RoutePrivate exact path="/contacts/add" component={ContactAddPage} />
        <RoutePrivate exact path="/contacts/:contactId" component={ContactDetailPage} />
        <RoutePrivate exact path="/messages" component={MessagesListPage} />
        <RoutePrivate exact path="/messages/add" component={MessageAddPage} />
        <RoutePrivate exact path="/messages/:messageId" component={MessageDetailPage} />
        <Route exact path="/signin" component={SignInPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </Switch>
    </Router>
  )
}
