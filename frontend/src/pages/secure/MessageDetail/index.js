import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import MessagesService from '../../../services/messages';
import { RenderMessageStatus } from '../MessagesList';

function RenderMessage({ message }) {
  return (
    <React.Fragment>
      <p><strong>Assunto:</strong> {message.subject}</p>
      <p><strong>Mensagem:</strong> {message.body}</p>
      <p>
        <strong>Status:</strong> <RenderMessageStatus status={message.status} />
      </p>
    </React.Fragment>
  )
}

class MessageDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSending: false,
      message: null,
    }
  }

  handleSendMessage = async (messageId) => {
    console.log('handleSendMessage', messageId);
    this.setState({ isSending: true });
    const service = new MessagesService();
    await service.send(messageId);
    this.setState({ isSending: false });
    this.props.history.push('/messages');
  }

  async componentDidMount() {
    const { params: { messageId } } = this.props.match;
    const service = new MessagesService();

    const result = await service.getOne(messageId);

    this.setState({ isLoading: false, message: result })
  }

  render() {
    const { isLoading, message, isSending } = this.state;

    return (
      <React.Fragment>
        <Header />
        <PageContent>
          <Container>
            <h2>Detalhes da mensagem</h2>
            {isLoading ? (
              <p>Carregando...</p>)
              : (
                <React.Fragment>
                  <RenderMessage message={message} />
                  <Button
                    variant="primary"
                    disabled={isSending}
                    onClick={() => this.handleSendMessage(message.id)}>
                    {isSending ? ("Enviando...") : ("Enviar mensagem")}
                  </Button>
                  <Link className="btn btn-light " to="/messages">Voltar</Link>
                </React.Fragment>
              )}
          </Container>
        </PageContent>
      </React.Fragment>
    )
  }
}

export default withRouter(MessageDetail);