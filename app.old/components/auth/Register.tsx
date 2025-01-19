'use client'
import { DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { SetPassword } from '../SetPassword'
import { useRegister, UseRegister } from './hooks/useRegister'
import { usePageContext } from '@/app.old/context'
import { Button } from '@/components/ui/button'

interface Props {
  readingFromLocalStorage: boolean
}

export const Register = ({ readingFromLocalStorage }: Props): JSX.Element => {
  const { openRegisterDialog } = usePageContext()
  const { waiting, emailError, passwordError, confirmPasswordError, password, setEmailError, setConfirmPasswordError, setPasswordScore, handleRegister, handleOpenDialog, handleCloseDialog, handleChangePassword }: UseRegister = useRegister()
  return (
    <>
      <Button
        loading={waiting || readingFromLocalStorage}
        variant='ghost'
        color='neutral'
        onClick={handleOpenDialog}
      >
        Register
      </Button>
      <Modal
        open={openRegisterDialog}
        onClose={handleCloseDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            Please fill out the form below to register.
          </DialogContent>
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <FormControl error={emailError !== ''}>
                <FormLabel>Email</FormLabel>
                <Input autoFocus name='email' type='email' required onChange={() => setEmailError('')}/>
                <FormHelperText>{emailError}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input name='username' type='text' required/>
              </FormControl>
              <SetPassword
                password={password}
                passwordError={passwordError}
                confirmPasswordError={confirmPasswordError}
                handleChangePassword={handleChangePassword}
                setConfirmPasswordError={setConfirmPasswordError}
                setPasswordScore={setPasswordScore}
              />
              <Button type='submit'>Register and login</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}
