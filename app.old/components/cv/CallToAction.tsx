'use client'
import { usePageContext } from '@/app.old/context'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Textarea, Typography } from '@mui/joy'
import { useCallToAction, UseCallToAction } from './hooks/useCallToAction'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export const CallToAction = (): JSX.Element => {
  const { setPlay } = usePageContext()
  const { 
    openDialog,
    nameError,
    emailError,
    messageError,
    isLoggedIn,
    setOpenDialog,
    handleSubmitForm
  }: UseCallToAction = useCallToAction()

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem', gap: '1rem' }}>
        <Typography level='h4' component='h4' style={{ fontWeight: 500, textAlign: 'center' }} gutterBottom>
          I am available for hire, let&#39;s work together!
        </Typography>
        <Box style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant='secondary'
            color='neutral'
            size='lg'
            onClick={() => setPlay(true)}
          >
            Play the game (Ctrl + \)
          </Button>
          <Button
            asChild
            variant='secondary'
            color='primary'
            size='lg'
          >
            <Link target="_blank" href='/Geoffrey_Faiers.pdf' rel="noopener noreferrer">Download CV</Link>
          </Button>
          {!isLoggedIn && (
            <Button
              variant='default'
              color='primary'
              size='lg'
              onClick={() => setOpenDialog(true)}
            >
              Contact me
            </Button>
          )}
        </Box>
      </Box>
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Contact Me</DialogTitle>
          <DialogContent>
            Please enter your email and a message, I will aim to get back to you as soon as possible.
          </DialogContent>
          {}
          <form onSubmit={handleSubmitForm}>
            <Stack spacing={2}>
              <FormControl error={nameError !== ''}>
                <FormLabel>Full Name</FormLabel>
                <Input autoFocus name='name' type='text' required/>
                <FormHelperText>{nameError}</FormHelperText>
              </FormControl>
              <FormControl error={emailError !== ''}>
                <FormLabel>Email</FormLabel>
                <Input name='email' type='text' required/>
                <FormHelperText>{emailError}</FormHelperText>
              </FormControl>
              <FormControl error={messageError !== ''}>
                <FormLabel>Message</FormLabel>
                <Textarea sx={{ maxHeight: '200px' }} name='message' minRows={5} required/>
                <FormHelperText>{messageError}</FormHelperText>
              </FormControl>
              <Button type='submit'>
                Send
                <FontAwesomeIcon icon={faPaperPlane}/>
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}
