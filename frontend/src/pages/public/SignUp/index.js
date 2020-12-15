import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

import AccountsService from '../../../services/accounts';
import Logo from '../../../assets/logo.png';

import { BoxContent, BoxForm } from '../../../shared/styles';

class SignUp extends React.Component {

  state = {
    name: '',
    email: '',
    password: '',
    domain: '',
    error: '',
    // isLoading: false,
  }

  handleSignUp = async (event) => {
    event.preventDefault();
    const { name, email, password, domain } = this.state;

    if (!name || !email || !domain || !password) {
      this.setState({ error: "Informe todos os campos para se cadastrar." })
    } else {
      try {
        const service = new AccountsService();
        await service.signup({ name, email, password, domain });
        this.props.history.push("/signin");
      } catch (error) {
        console.log(`[handleSignUp] ERROR: ${error}`)
        this.setState({ error: "Occorreu um erro ao tentar cadastrar." })
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
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <BoxContent>
              <img src={Logo} alt="Mail Spider" style={{ maxHeight: 250 }}>
              </img>
            </BoxContent>
            <BoxForm>
              <h2>Cadastro</h2>
              <p>Informe seus dados para cadastro:</p>
              {
                //JSON.stringify(this.state)
              }
              <Form onSubmit={this.handleSignUp}>
                {this.state.error && this.renderError()}
                <Form.Group controlId="nameGroup">
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu nome"
                    onChange={e => this.setState({ name: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="emailGroup">
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    onChange={e => this.setState({ email: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="domainGroup">
                  <Form.Label>Dominio:</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Digite seu domínio"
                    onChange={e => this.setState({ domain: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="passwordGroup">
                  <Form.Label>Senha:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    onChange={e => this.setState({ password: e.target.value })} />
                </Form.Group>
                <Button block variant="primary" type="submit">
                  Confirmar cadastro
              </Button>
              </Form>
            </BoxForm>
            <BoxContent>
              <p>Já possui cadastro?</p>
              <Link className="button" to="/signin">Voltar para login</Link>
            </BoxContent>
          </Col>
        </Row>
      </Container>
    )
  }

}

export default withRouter(SignUp);