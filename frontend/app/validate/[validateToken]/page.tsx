'use client'
import { Container, Box, Typography, CircularProgress } from '@mui/joy'
import { useParams } from 'next/navigation'
import { useValidateEmail } from './useValidateEmail'

export default function ResetPasswordPage (): JSX.Element {
  const { validateToken } = useParams()
  const token = Array.isArray(validateToken) ? validateToken[0] : validateToken
  const { error } = useValidateEmail({ validateToken: token as string })

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: '400px',
          padding: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2
        }}
      >
        <Typography level='h4' component='h1' gutterBottom>
          Validate Email
        </Typography>
        {!error && (<CircularProgress />)}
        {error && <Typography component='p'>{error}</Typography>}
      </Box>
    </Container>
  )
}