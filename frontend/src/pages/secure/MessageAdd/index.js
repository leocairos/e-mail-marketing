import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col } from 'react-bootstrap';

import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import MessagesService from '../../../services/messages';

class MessageAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: '',
      body: '',
      error: '',
      isLoading: false,
    }
  }

  handleSave = async (event) => {
    event.preventDefault();

    const { subject, body } = this.state;

    if (!subject || !body) {
      this.setState({ error: "Informe todos os campos da mensagem." })
    } else {
      try {
        const service = new MessagesService();
        await service.add({ subject, body });
        this.props.history.push("/messages");
      } catch (error) {
        console.log(`[messageAdd.handleSave] ERROR: ${error}`)
        this.setState({ error: "Occorreu um erro ao tentar cadastrar mensagem." })
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
      <React.Fragment>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Adicionar mensagem</h3>
                <p>Preencha as informações da mensagem</p>
              </Col>
            </Row>
            <Row>
              <Col lg={6} sm={122}>
                {this.state.error && this.renderError()}
                <Form onSubmit={this.handleSave}>
                  <Form.Group controlId="subjectGroup">
                    <Form.Label>Assunto:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o asunto"
                      onChange={e => this.setState({ subject: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="bodyGroup">
                    <Form.Label>Corpo da mensagem:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Digite o corpo da mensagem"
                      onChange={e => this.setState({ body: e.target.value })} />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Adicionar mensagem
                  </Button>
                  <Link className="btn btn-light " to="/messages">Voltar</Link>
                </Form>
              </Col>
            </Row>
          </Container>
        </PageContent>
      </React.Fragment>
    )
  }
}

export default withRouter(MessageAdd);