'use client'
import { DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { UseForgotPassword, useForgotPassword } from './hooks/useForgotPassword'
import { Button } from '@/components/ui/button'

export const ForgotPassword = (): JSX.Element => {
  const { openPasswordDialog, openMessageDialog, handleForgotPassword, handleClosePasswordDialog, handleGenerateResetToken, handleCloseMessageDialog }: UseForgotPassword = useForgotPassword()

  return (
    <>
      <a className='ml-auto text-sm underline-offset-4 hover:underline' onClick={handleForgotPassword}>
        Forgot Password?
      </a>
      <Modal
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            Please enter your email address, we&apos;ll email you a link to reset your password.
          </DialogContent>
          <form onSubmit={handleGenerateResetToken}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input autoFocus name='email' type='email' required/>
              </FormControl>
              <Button type='submit'>Send email</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Modal
        open={openMessageDialog}
        onClose={handleCloseMessageDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            Please check your emails.
          </DialogContent>
          <Button onClick={handleCloseMessageDialog}>OK</Button>
        </ModalDialog>
      </Modal>
    </>
  )
}
