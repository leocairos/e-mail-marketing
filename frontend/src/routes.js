import React from 'react';
import SignIn from './pages/public/SignIn';
import SignUp from './pages/public/SignUp';
import Dashboard from './pages/secure/Dashboard';

import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams, useRouteMatch
} from 'react-router-dom';


function Contact() {
  let { contactId } = useParams();
  return (
    <div>
      <h3>Contato {contactId}</h3>
    </div>
  )
}

function Contatos() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Menu></Menu>
      <h2>Lista Contatos</h2>
      <ul>
        <li>
          <Link to={`${url}/111`}>Contato A</Link>
        </li>
        <li>
          <Link to={`${url}/222`}>Contato B</Link>
        </li>
        <li>
          <Link to={`${url}/333`}>Contato C</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path={path} />
        <Route path={`${path}/:contactId`} component={Contact} />
      </Switch>
    </div>
  )
}

function Message() {
  let { messageId } = useParams();
  return (
    <div>
      <h3>Mensagem {messageId}</h3>
    </div>
  )
}

function Messages() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Menu></Menu>
      <h2>Lista de Mensagens</h2>
      <ul>
        <li>
          <Link to={`${url}/111`}>Mensagem A</Link>
        </li>
        <li>
          <Link to={`${url}/222`}>Mensagem B</Link>
        </li>
        <li>
          <Link to={`${url}/333`}>Mensagem C</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path={path} />
        <Route path={`${path}/:messageId`} component={Message} />
      </Switch>
    </div>
  )
}

function Menu() {
  return (
    <ul>
      <li>
        <Link to="/contacts">Contatos</Link>
      </li>
      <li>
        <Link to="/messages">Mensagens</Link>
      </li>
      <li>
        <Link to="/signin">Sair</Link>
      </li>
    </ul>
  )
}

export default function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/contacts" component={Contatos} />
          <Route path="/messages" component={Messages} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </div>
    </Router>
  )
}