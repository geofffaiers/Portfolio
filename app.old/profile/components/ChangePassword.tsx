import { DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { useChangePassword } from '../hooks/useChangePassword'
import { useUserValidations } from '@/app.old/hooks/useUserValidations'
import { PasswordStrength } from '@/app.old/components/PasswordStrength'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
}

export const ChangePassword = ({ open, onClose }: Props): JSX.Element => {
  const { setPasswordScore, validatePassword, passwordError, confirmPasswordError } = useUserValidations()

  const closeChangePassword = () => {
    setPasswordScore(0)
    setCurrentPassword('')
    setPassword('')
    setConfirmPassword('')
    onClose()
  }

  const { setCurrentPassword, password, setPassword, setConfirmPassword, tempUser, handleChangePassword} = useChangePassword({ validatePassword, onClose: closeChangePassword })

  if (tempUser == null) {
    return <></>
  }

  return (
    <Modal open={open} onClose={closeChangePassword}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          Please enter your current password and then your new password.
        </DialogContent>
        <form onSubmit={handleChangePassword}>
          <Stack spacing={2}>
            <FormControl error={passwordError !== ''}>
              <FormLabel>Current Password</FormLabel>
              <Input name='currentPassword' type='password' required onChange={(e) => setCurrentPassword(e.target.value)}/>
              <FormHelperText>{passwordError}</FormHelperText>
            </FormControl>
            <FormControl error={passwordError !== ''}>
              <FormLabel>New Password</FormLabel>
              <Input name='password' type='password' required onChange={(e) => setPassword(e.target.value)}/>
              <FormHelperText>{passwordError}</FormHelperText>
            </FormControl>
            <FormControl error={confirmPasswordError !== ''}>
              <FormLabel>Confirm New Password</FormLabel>
              <Input name='confirmPassword' type='password' required onChange={(e) => setConfirmPassword(e.target.value)}/>
              <FormHelperText>{confirmPasswordError}</FormHelperText>
            </FormControl>
            <PasswordStrength password={password} setPasswordScore={setPasswordScore}/>
            <Button
              type='submit'
              color='primary'
            >
              Change Password
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}