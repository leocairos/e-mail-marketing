import React from 'react';
import { Container, Table, Row, Col, Badge } from 'react-bootstrap';
import { withRouter, Link, useRouteMatch } from 'react-router-dom';

import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import MessagesService from '../../../services/messages';

function RenderLine({ message }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { url } = useRouteMatch();

  return (
    <tr key={message.id}>
      <td><Link to={`${url}/${message.id}`}>{message.subject}</Link></td>
      <td>{message.status}</td>
    </tr>
  )
}

function RenderEmptyRow() {
  return (
    <tr>
      <td colSpan="2">Nenhuma mensagem para listar.</td>
    </tr>
  )
}

function RenderTable({ messages }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Assunto</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {messages.length === 0 && <RenderEmptyRow />}
        {messages.map(item => <RenderLine key={item.id} message={item} />)}
      </tbody>
    </Table>
  )
}

function RenderButtonAdd() {
  const { url } = useRouteMatch();
  return (
    <Link
      className="btn btn-success float-right"
      to={`${url}/add`}>Adicionar messagem</Link>
  )
}

class MessagesList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      messages: []
    }
  }

  async componentDidMount() {
    const service = new MessagesService();
    const result = await service.getAll();

    console.log(result)
    this.setState({ isLoading: false, messages: result })
  }

  render() {
    const { messages } = this.state;
    return (
      <React.Fragment>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Mensagens</h3>
              </Col>
              <Col>
                <RenderButtonAdd />
              </Col>
            </Row>
            <p>Relação de mensagens cadastradas</p>
            <RenderTable messages={messages} />
          </Container>
        </PageContent>
      </React.Fragment>
    )
  }
}

export default withRouter(MessagesList);