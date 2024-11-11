import { DefaultResponse } from '../models/DefaultResponse'

export const defaultError = (error: Error): DefaultResponse => {
  console.error(error)
  return {
    success: false,
    message: error.message.replaceAll('Error: ', ''),
    stack: error.stack
  }
}
