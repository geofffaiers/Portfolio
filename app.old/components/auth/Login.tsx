'use client'
import { FormControl, FormLabel, Input, Stack, Typography } from '@mui/joy'
import { ForgotPassword } from './ForgotPassword'
import { UseLogin, useLogin } from './hooks/useLogin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Props {
  readingFromLocalStorage: boolean
}

export const Login = ({ readingFromLocalStorage }: Props): JSX.Element => {
  const {
    open,
    setOpen,
    loggingIn,
    handleLogin
  }: UseLogin = useLogin()

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            loading={loggingIn || readingFromLocalStorage}
            variant='ghost'
            color='neutral'
          >
            Login
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Please enter your username and password.</DialogDescription>
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
        </DialogContent>
      </Dialog>
    </>
  )
}
