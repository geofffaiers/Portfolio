'use client'
import { useState, useEffect } from 'react'
import { Box, Button, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy'

export const CookieConsent = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setOpen(true)
    }
  }, [])

  const handleAccept = (): void => {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)
    localStorage.setItem('cookieConsent', expiryDate.toISOString())
    setOpen(false)
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} disableEscapeKeyDown={true}>
      <ModalDialog>
        <DialogTitle>Cookie Consent</DialogTitle>
        <DialogContent>
          <Typography>
            This website uses cookies to ensure you get the best experience on our website.
          </Typography>
          <Typography>
            The cookies are used to manage authentication, there are no advertising cookies, and no tracking cookies.
          </Typography>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant='solid' color='primary' onClick={handleAccept}>
            Accept
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
