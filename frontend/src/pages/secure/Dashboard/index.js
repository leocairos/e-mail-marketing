import React from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

class Dashboard extends React.Component {

  render() {
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <h2>Dashboard</h2>
            <p>Aqui podemos listas os ultimos envios</p>
          </Container>
        </PageContent>
      </>
    )
  }
}

export default withRouter(Dashboard);