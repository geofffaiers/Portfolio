import { User } from '@/app/models'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Grid, IconButton, Typography } from '@mui/joy'

interface Props {
  loggedInUser: User | null
}

export const Details = ({ loggedInUser }: Props): JSX.Element => {
  const isLoggedIn: boolean = !!loggedInUser

  return (
    <Grid container padding='1.5rem'>
      <Grid width='100%' display='flex' flexDirection='row'>
        <Typography level='h1' component='h1' gutterBottom display='inline' marginRight='auto'>
          Geoff Faiers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <IconButton href='https://www.linkedin.com/in/gfaiers/' component='a' target='_blank' aria-label='LinkedIn' size='lg' variant='plain'>
            <FontAwesomeIcon icon={faLinkedin}/>
          </IconButton>
          <IconButton href='https://github.com/geofffaiers' component='a' target='_blank' aria-label='GitHub' size='lg' variant='plain'>
            <FontAwesomeIcon icon={faGithub}/>
          </IconButton>
          <IconButton href={`mailto:${isLoggedIn ? 'geoff' : 'info'}@gfaiers.com`} component='a' aria-label='Email' size='lg' variant='plain'>
            <FontAwesomeIcon icon={faEnvelope}/>
          </IconButton>
        </Box>
      </Grid>
      <Typography level='h4' component='h4' style={{ fontWeight: 500 }} gutterBottom>
        {isLoggedIn
          ? '8 Segrave Walk, York, YO26 4UD / 07795102820 / geoff@gfaiers.com'
          : 'York, United Kingdom / 07795102820 / info@gfaiers.com'}
      </Typography>
    </Grid>
  )
}
