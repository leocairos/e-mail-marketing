import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col } from 'react-bootstrap';

import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import ContactsService from '../../../services/contacts';

class ContactAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: '',
      error: '',
      isLoading: false,
    }
  }

  handleSave = async (event) => {
    event.preventDefault();

    const { name, email, phone } = this.state;

    if (!name || !email || !phone) {
      this.setState({ error: "Informe todos os campos do contato." })
    } else {
      try {
        const service = new ContactsService();
        await service.add({ name, email, phone });
        this.props.history.push("/contacts");
      } catch (error) {
        console.log(`[handleSave] ERROR: ${error}`)
        this.setState({ error: "Occorreu um erro ao tentar cadastrar contato." })
      }
    }

  }

  renderError = () => {
    return (
      <Alert variant="danger">{this.state.error}</Alert>
    )
  }

  render() {
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Adicionar contato</h3>
                <p>Preencha as informações do contato</p>
              </Col>
            </Row>
            <Row>
              <Col lg={6} sm={122}>
                {this.state.error && this.renderError()}
                <Form onSubmit={this.handleSave}>
                  <Form.Group controlId="nameGroup">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome"
                      onChange={e => this.setState({ name: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="emailGroup">
                    <Form.Label>E-mail:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Digite o e-mail"
                      onChange={e => this.setState({ email: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="domainGroup">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o telefone"
                      onChange={e => this.setState({ phone: e.target.value })} />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Adicionar contato
                  </Button>
                  <Link className="btn btn-link " to="/contacts">Voltar</Link>
                </Form>
              </Col>
            </Row>
          </Container>
        </PageContent>
      </>
    )
  }
}

export default withRouter(ContactAdd);