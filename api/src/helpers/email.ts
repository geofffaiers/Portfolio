import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { User } from '../models'

interface EmailParams {
  to: string
  subject: string
  text: string
  html: string
}
interface EmailTemplate {
  main: string
  header: string
  body: string
  footer: string
  button: string
}
const emailTemplate: EmailTemplate = {
  main: '',
  header: '',
  body: '',
  footer: '',
  button: ''
}

const sendEmail = async ({ to, subject, text, html }: EmailParams): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: 'send.one.com',
    port: 587,
    secure: false,
    auth: {
      user: 'noreply@gfaiers.com',
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const mailOptions: Mail.Options = {
    from: 'noreply@gfaiers.com',
    to,
    subject,
    text,
    html
  }
  await transporter.sendMail(mailOptions)
}

const loadEmailTemplate = (): EmailTemplate => {
  if (emailTemplate.main === '') {
    try {
      const basePath = path.resolve(__dirname, '../../emails')
      emailTemplate.main = fs.readFileSync(path.join(basePath, 'main.html'), 'utf8')
      emailTemplate.header = fs.readFileSync(path.join(basePath, 'header.html'), 'utf8')
      emailTemplate.body = fs.readFileSync(path.join(basePath, 'body.html'), 'utf8')
      emailTemplate.footer = fs.readFileSync(path.join(basePath, 'footer.html'), 'utf8')
      emailTemplate.button = fs.readFileSync(path.join(basePath, 'button.html'), 'utf8')
    } catch (err: any) {
      throw new Error(err)
    }
  }
  return structuredClone(emailTemplate)
}

export const sendValidateEmail = async (user: User): Promise<void> => {
  const template: EmailTemplate = loadEmailTemplate()
  const validateButton: string = structuredClone(template.button)
    .replaceAll('{{TEXT}}', 'Validate Email')
    .replaceAll('{{URL}}', `${process.env.CLIENT_URL ?? ''}/validate/${user.validateToken ?? ''}`)
    .replace('{{SIZE}}', 'm')
  template.body = template.body
    .replace(
      '{{CONTENT}}',
      `<h3 class="infoBlockTop">
        Validate Email
      </h3>
      <p class="infoBlockMiddle">
        Thank you for registering at gfaiers.com. Please click the button below to validate your email address.
      </p>
      <p class="infoBlockMiddle">
        This link is valid for 5 minutes, until ${user.validateTokenExpires?.toLocaleString('en-GB') ?? 'expiry time not set'}.
      </p>
      ${validateButton}`
    )
  const html: string = template.main
    .replace('{{SUMMARY}}', `Validate Email for ${user.username}`)
    .replace('{{HEADER}}', template.header)
    .replace('{{BODY}}', template.body)
    .replace('{{FOOTER}}', template.footer)
  await sendEmail({
    to: user.email,
    subject: 'Validate Email',
    text: 'Click the link to validate your email',
    html
  })
}

export const sendResetPasswordEmail = async (user: User): Promise<void> => {
  const template: EmailTemplate = loadEmailTemplate()
  const resetButton: string = structuredClone(template.button)
    .replaceAll('{{TEXT}}', 'Reset Password')
    .replaceAll('{{URL}}', `${process.env.CLIENT_URL ?? ''}/reset-password/${user.resetToken ?? ''}`)
    .replace('{{SIZE}}', 'm')
  template.body = template.body
    .replace(
      '{{CONTENT}}',
      `<h3 class="infoBlockTop">
        Reset Password
      </h3>
      <p class="infoBlockMiddle">
        Your account ${user.username} has requested a password reset. If this wasn't you, please ignore this email.<br />
        If you have requested to reset, please click the button below.
      </p>
      <p class="infoBlockMiddle">
        This link is valid for 5 minutes, until ${user.resetTokenExpires?.toLocaleString('en-GB') ?? 'expiry time not set'}.
      </p>
      ${resetButton}`
    )
  const html: string = template.main
    .replace('{{SUMMARY}}', `Reset Password for ${user.username}`)
    .replace('{{HEADER}}', template.header)
    .replace('{{BODY}}', template.body)
    .replace('{{FOOTER}}', template.footer)
  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    text: 'Click the link to reset your password',
    html
  })
}

export const sendContactEmail = async (name: string, email: string, message: string): Promise<void> => {
  const template: EmailTemplate = loadEmailTemplate()
  template.body = template.body
    .replace(
      '{{CONTENT}}',
      `<h3 class="infoBlockTop">
        Contact Form
      </h3>
      <p class="infoBlockMiddle">
        ${message}
      </p>`
    )
  const html: string = template.main
    .replace('{{SUMMARY}}', `${name} has filled in the contact form`)
    .replace('{{HEADER}}', template.header)
    .replace('{{BODY}}', template.body)
    .replace('{{FOOTER}}', template.footer)
  await sendEmail({
    to: email,
    subject: 'Geoff Faiers gfaiers.com',
    text: message,
    html
  })
  await sendEmail({
    to: 'info@gfaiers.com',
    subject: `${name}: Contact Form`,
    text: message,
    html
  })
}
