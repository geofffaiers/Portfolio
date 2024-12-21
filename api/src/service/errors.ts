import { DefaultResponse } from '../models/responses/DefaultResponse'

export const defaultError = (error: Error): DefaultResponse => {
  console.error(error)
  return {
    code: 500,
    success: false,
    message: error.message.replaceAll('Error: ', ''),
    stack: error.stack
  }
}
