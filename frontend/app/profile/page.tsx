'use client'
import { Container, Box, Typography, IconButton } from '@mui/joy'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useProfile } from './hooks/useProfile'

export default function ProfilePage (): JSX.Element {
  const router = useRouter()
  const { onSubmit } = useProfile()

  const handleBackClick = () => {
    router.push('/')
  }

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
        component='form'
        onSubmit={onSubmit}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            aria-label='back'
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </IconButton>
          <Typography level='h4' component='h1' gutterBottom>
            User Profile
          </Typography>
        </Box>
        {/* Add form fields here to update user properties */}
      </Box>
    </Container>
  )
}
