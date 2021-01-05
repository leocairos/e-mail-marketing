require('dotenv-safe').config({
  example: '../.env.example',
  path: '../.env',
})

import microservicesAuth from '../../__commons__/src/api/auth/microservicesAuth';

const tokenMS = microservicesAuth.sign({
  id: "cc75207a-2848-4ad4-9f47-222353579f8f",
  contactId: 1,
  accountId: 1,
  messageId: 1
})

console.log('\n\ntokenMS:', tokenMS, '\n\n')