import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy'
import { PasswordStrength } from './PasswordStrength'
import { ChangeEvent } from 'react'

interface Props {
  password: string
  passwordError: string
  confirmPasswordError: string
  handleChangePassword: (evt: ChangeEvent<HTMLInputElement>) => void
  setConfirmPasswordError: (error: string) => void
  setPasswordScore: (score: number) => void
}

export const SetPassword = ({ password, passwordError, confirmPasswordError, handleChangePassword, setConfirmPasswordError, setPasswordScore }: Props): JSX.Element => {
  return (
    <>
      <FormControl error={passwordError !== ''}>
        <FormLabel>Password</FormLabel>
        <Input name='password' type='password' required onChange={handleChangePassword}/>
        <FormHelperText>{passwordError}</FormHelperText>
      </FormControl>
      <FormControl error={confirmPasswordError !== ''}>
        <FormLabel>Confirm Password</FormLabel>
        <Input name='confirmPassword' type='password' required onChange={() => setConfirmPasswordError('')}/>
        <FormHelperText>{confirmPasswordError}</FormHelperText>
      </FormControl>
      <PasswordStrength password={password} setPasswordScore={setPasswordScore}/>
    </>
  )
}
