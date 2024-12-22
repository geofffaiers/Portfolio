'use client'
import { Button, DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { ForgotPassword } from './ForgotPassword'
import { UseLogin, useLogin } from './hooks/useLogin'

interface Props {
  readingFromLocalStorage: boolean
}

export const Login = ({ readingFromLocalStorage }: Props): JSX.Element => {
  const { 
    openLoginDialog,
    loggingIn,
    handleLogin,
    handleOpenDialog,
    handleCloseDialog
  }: UseLogin = useLogin()

  return (
    <>
      <Button
        loading={loggingIn || readingFromLocalStorage}
        variant='solid'
        color='neutral'
        onClick={handleOpenDialog}
      >
        Login
      </Button>
      <Modal
        open={openLoginDialog}
        onClose={handleCloseDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            Please enter your username and password.
          </DialogContent>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input autoFocus name='username' type='text' required/>
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input name='password' type='password' required/>
              </FormControl>
              <ForgotPassword/>
              <Button type='submit'>Login</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}
