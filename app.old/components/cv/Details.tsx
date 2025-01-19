import { usePageContext } from '@/app.old/context'
import { Button } from '@/components/ui/button'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Grid, Typography } from '@mui/joy'
import Link from 'next/link'

export const Details = (): JSX.Element => {
  const { loggedInUser } = usePageContext()
  const isLoggedIn: boolean = !!loggedInUser

  return (
    <Grid container padding='1.5rem'>
      <Grid width='100%' display='flex' flexDirection='row'>
        <Typography level='h1' component='h1' gutterBottom display='inline' marginRight='auto'>
          Geoff Faiers
        </Typography>
        <Box sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
          <Button
            asChild
            variant='ghost'
            size='icon'>
            <Link href='https://www.linkedin.com/in/gfaiers/' target='_blank' aria-label='LinkedIn'>
              <FontAwesomeIcon icon={faLinkedin}/>
            </Link>
          </Button>
          <Button
            asChild
            variant='ghost'
            size='icon'>
            <Link href='https://github.com/geofffaiers' target='_blank' aria-label='GitHub'>
              <FontAwesomeIcon icon={faGithub}/>
            </Link>
          </Button>
          <Button
            asChild
            variant='ghost'
            size='icon'>
            <a href={`mailto:${isLoggedIn ? 'geoff' : 'info'}@gfaiers.com`} aria-label='Email'>
              <FontAwesomeIcon icon={faEnvelope}/>
            </a>
          </Button>
        </Box>
      </Grid>
      <Typography level='h4' component='h4' style={{ fontWeight: 500 }} gutterBottom>
        {isLoggedIn
          ? '8 Segrave Walk, York, YO26 4UD / 07795102820 / geoff@gfaiers.com'
          : 'York, United Kingdom / info@gfaiers.com'}
      </Typography>
    </Grid>
  )
}
