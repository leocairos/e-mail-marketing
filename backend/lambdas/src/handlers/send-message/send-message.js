const sqsParse = require('../../../lib/aws-parse-sqs');

async function sendMessage(event) {
  try {
    const isSQSMessage = Boolean(event.Records);

    if (isSQSMessage) {
      console.log('Função de envio foi chamado pelo SQS');

      const payloadParsed = await sqsParse.parseMessages(event);
      const payload = JSON.parse(payloadParsed[0]);

      console.log(`messageId: ${payload.messageId}`);
      console.log(`accountId: ${payload.accountId}`);
      console.log(`contactId: ${payload.contactId}`);

      return {
        statusCode: 200,
      }
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    }
  }
}

module.exports = sendMessage;