import { useUserValidations } from "@/app/hooks/useUserValidations"
import { faCheckCircle, faClose, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, CircularProgress, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, Modal, ModalClose, ModalDialog, Snackbar, Stack } from "@mui/joy"
import { ChangeEvent, useEffect } from "react"
import { useProfile } from "../hooks/useProfile"

export const ProfileForm = (): JSX.Element => {
  const { validate, usernameError, emailError, firstNameError, lastNameError } = useUserValidations()
  const { tempUser, handleChangeValue, handleSaveChanges, showDeleteAccount, setShowDeleteAccount, handleDeleteAccount, error, setError, userChanged, emailMatched } = useProfile({ validate })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        handleSaveChanges()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSaveChanges])
  
  if (!tempUser) {
    return (
      <CircularProgress />
    )
  }

  return (
    <>
      <form
        onSubmit={handleSaveChanges}
        className='flex flex-col gap-2 p-6'
      >
        <FormControl error={usernameError !== ''}>
          <FormLabel>Username</FormLabel>
          <Input name='username' type='text' required value={tempUser.username} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValue('username', e.target.value)}/>
          <FormHelperText>{usernameError}</FormHelperText>
        </FormControl>
        <FormControl error={emailError !== ''}>
          <FormLabel>Email</FormLabel>
          <div className='relative'>
            <Input name='email' type='email' required value={tempUser.email} className='pr-10' onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValue('email', e.target.value)}/>
            <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
              {tempUser.isEmailVerified ? (
                <FontAwesomeIcon icon={faCheckCircle} className='text-green-500' title='Verified'/>
              ) : (
                <FontAwesomeIcon icon={faTimesCircle} className='text-red-500' title='Not verified'/>
              )}
            </span>
          </div>
          <FormHelperText>{emailError}</FormHelperText>
        </FormControl>
        {/* {!tempUser.isEmailVerified && (
          <Button type='submit' color='neutral'>
            Resend Verification Email
          </Button>
        )} */}
        <FormControl error={firstNameError !== ''}>
          <FormLabel>First Name</FormLabel>
          <Input name='firstName' type='text' required value={tempUser.firstName} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValue('firstName', e.target.value)}/>
          <FormHelperText>{firstNameError}</FormHelperText>
        </FormControl>
        <FormControl error={lastNameError !== ''}>
          <FormLabel>Last Name</FormLabel>
          <Input name='lastName' type='text' required value={tempUser.lastName} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValue('lastName', e.target.value)}/>
          <FormHelperText>{lastNameError}</FormHelperText>
        </FormControl>
        <Button type='submit' color='primary' disabled={!userChanged}>
          Save Changes
        </Button>
        <Button type='submit' color='danger' onClick={() => setShowDeleteAccount(true)}>
          Delete My Account
        </Button>
      </form>
      <Modal
        open={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
      >
        <ModalDialog color='danger'>
          <ModalClose />
          <DialogTitle>Delete My Account</DialogTitle>
          <DialogContent>
            Please type your email address below to confirm deletion of your account.
          </DialogContent>
          <form onSubmit={handleDeleteAccount}>
            <Stack spacing={2}>
              <FormControl error={emailMatched === false}>
                <FormLabel>Email</FormLabel>
                <Input autoFocus name='email' type='email' required/>
                <FormHelperText>{emailMatched === false && 'Email does not match'}</FormHelperText>
              </FormControl>
              <Button type='submit' color='danger'>Delete Account</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={error !== ''}
        autoHideDuration={6000}
        onClose={() => setError('')}
        variant='soft'
        color='danger'
        size='md'
        endDecorator={
          <IconButton
            variant='soft'
            color='danger'
            onClick={() => setError('')}
          >
            <FontAwesomeIcon icon={faClose}/>
          </IconButton>
        }
      >
        {error}
      </Snackbar>
    </>
  )
}
