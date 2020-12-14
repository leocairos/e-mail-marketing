import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';

import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import ContactsService from '../../../services/contacts';

function RenderContact({ contact }) {
  return (
    <React.Fragment>
      <p>Nome: {contact.name}</p>
      <p>E-mail: {contact.email}</p>
      <p>Telefone: {contact.phone}</p>
    </React.Fragment>
  )
}

class ContactDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contact: null,
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



  getContact = async (contactId) => {
    const service = new ContactsService();

    const result = await service.getOne(contactId);

    this.setState({ isLoading: false, contact: result })
  }

  async componentDidMount() {
    const { params: { contactId } } = this.props.match
    await this.getContact(contactId);
  }

  render() {
    const { isLoading, contact } = this.state;

    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <h3>Dados do contato</h3>
            {isLoading ? (
              <p>Carregando...</p>)
              : (<RenderContact contact={contact} />)}
          </Container>
        </PageContent>
      </>
    )
  }
}

export default withRouter(ContactDetail);