import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_SES_REGION });

const EMAIL_ENCONDING: string = 'UTF-8';

export type DnsRecord = { type: string, name: string, value: string, priority?: number };

export type DnsSettings = { dnsRecords: Array<DnsRecord>, verified: boolean };

export type AccountSettings = {
  Domain: DnsSettings, DKIM: DnsSettings,
  SPF: DnsSettings, EmailAddresses: EmailSetting[]
};

export type EmailSetting = { email: string; verified: boolean };

export type SendEmailResponse = { success: boolean, messageId?: string };

async function getEmailSettings(emails: string[]) {
  const ses = new AWS.SESV2();
  const promises = emails.map(email => {
    return ses.getEmailIdentity({ EmailIdentity: email }).promise();
  })

  const results = await Promise.all(promises);
  let emailSettings = [] as Array<EmailSetting>;
  for (let x = 0; x < results.length; x++) {
    emailSettings.push({
      email: emails[x],
      verified: results[x].VerifiedForSendingStatus!
    } as EmailSetting)
  }

  return emailSettings;
}

async function addEmailIdentity(domainOrEmail: string) {
  const ses = new AWS.SESV2();
  const parms = { EmailIdentity: domainOrEmail };

  return await ses.createEmailIdentity(parms).promise();
}

async function setMailFromDomain(domain: string) {
  const ses = new AWS.SESV2();
  const parms = {
    EmailIdentity: domain,
    BehaviorOnMxFailure: 'USE_DEFAULT_VALUE',
    MailFromDomain: `mailspider.${domain}`
  }

  return await ses.putEmailIdentityMailFromAttributes(parms).promise();
}

function getDkimSettings(domain: string, response: AWS.SESV2.GetEmailIdentityResponse) {
  const dkimArray = response.DkimAttributes!.Tokens!.map(token => {
    return {
      type: 'CNAME',
      name: `${token}._domainkey.${domain}`,
      value: `${token}.dkim.amazonses.com`
    } as DnsRecord;
  })

  return {
    dnsRecords: dkimArray,
    verified: response.DkimAttributes!.Status === 'SUCCESS'
  } as DnsSettings;
}

function getSpfSettings(domain: string, response: AWS.SESV2.GetEmailIdentityResponse) {
  const mx = {
    type: 'MX',
    name: `mailspider.${domain}`,
    value: `feedback-smtp.${process.env.AWS_SES_REGION}.amazonses.com`,
    priority: 10
  } as DnsRecord;

  const txt = {
    type: 'TXT',
    name: `mailspider.${domain}`,
    value: `v=spf1 include:amazonses.com ~all`,
  } as DnsRecord;

  const verified = response.MailFromAttributes!.MailFromDomainStatus === 'SUCCESS';

  return {
    verified, dnsRecords: [mx, txt]
  } as DnsSettings;
}

async function getDomainSettings(domain: string) {
  const ses = new AWS.SES();
  const parms = { Identities: [domain] };
  const response = await ses.getIdentityVerificationAttributes(parms).promise();

  const dnsRecord = {
    type: 'TXT',
    name: `_amazonses.${domain}`,
    value: response.VerificationAttributes[domain]['VerificationToken']
  } as DnsRecord;

  const verified = response.VerificationAttributes[domain]['VerificationStatus'] === 'Success';

  return {
    dnsRecords: [dnsRecord],
    verified
  } as DnsSettings
}

async function getAccountSettings(domain: string, emails: string[]) {
  const ses = new AWS.SESV2();
  const parms = { EmailIdentity: domain };

  console.log('getAccountSettingsAAAAAAAAAA')
  const response = await ses.getEmailIdentity(parms).promise();
  console.log('getAccountSettingsBBBBBBBBBB')
  const dkimSettings = getDkimSettings(domain, response);
  console.log('getAccountSettingsCCCCCCCCCC')
  const spfSettings = getSpfSettings(domain, response);
  console.log('getAccountSettingsDDDDDDD')
  const domainSettings = await getDomainSettings(domain);
  console.log('getAccountSettingsEEEEEEEEEEE')

  let emailAddresses = [] as Array<EmailSetting>;
  if (emails && emails.length > 0)
    emailAddresses = await getEmailSettings(emails);

  return {
    DKIM: dkimSettings,
    SPF: spfSettings,
    Domain: domainSettings,
    EmailAddresses: emailAddresses
  } as AccountSettings;
}

async function createAccountSettings(domain: string) {
  const identityResponse = await addEmailIdentity(domain);
  const MailFromDomainResponse = await setMailFromDomain(domain);
  return getAccountSettings(domain, []);
}

async function removeEmailIdentity(domainOrEmail: string) {
  const ses = new AWS.SESV2();
  const parms = { EmailIdentity: domainOrEmail };

  try {
    return await ses.deleteEmailIdentity(parms).promise();
  } catch (error) {
    if (error.statusCode === 404) return true;
    throw error;
  }
}

async function canSendEmail(email: string) {
  const emailSetting = await getEmailSettings([email]);
  return emailSetting && emailSetting.length > 0 && emailSetting[0].verified;
}

async function sendEmail(
  fromName: string, fromAddress: string, toAddress: string,
  subject: string, body: string) {
  if (!canSendEmail(fromAddress)) return { success: false } as SendEmailResponse;

  const ses = new AWS.SESV2();
  const params = {
    Content: {
      Simple: {
        Body: {
          Html: { Data: body, Charset: EMAIL_ENCONDING }
        },
        Subject: { Data: subject, Charset: EMAIL_ENCONDING }
      }
    },
    Destination: { ToAddresses: [toAddress] },
    FeedbackForwardingEmailAddress: fromAddress,
    FromEmailAddress: `${fromName} <${fromAddress}>`,
    ReplyToAddresses: [fromAddress]
  }

  const response = await ses.sendEmail(params).promise();

  return {
    success: !!response.MessageId,
    messageId: response.MessageId
  } as SendEmailResponse;
}
export default {
  addEmailIdentity,
  createAccountSettings,
  getAccountSettings,
  removeEmailIdentity,
  getEmailSettings,
  canSendEmail,
  sendEmail
}