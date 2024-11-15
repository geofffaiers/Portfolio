import { Container, Typography, Card, CardContent, IconButton, Grid, Box } from '@mui/joy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const data = [
  {
    title: 'Professional Summary',
    items: [
      {
        description: 'Principal Engineer with extensive experience in leading high-performing teams and driving operational excellence. Proven track record in managing software development projects, fostering a culture of continuous improvement, and delivering innovative solutions. Adept at leveraging hands-on technical expertise to guide teams through modern agile practices.'
      }
    ]
  },
  {
    title: 'Technical Skills',
    items: [
      {
        description: 'Leadership & Management: Team performance management, line management, coaching, and mentoring'
      },
      {
        description: 'Software Development: SaaS, secure software development, design and architecture'
      },
      {
        description: 'Technical Proficiency: JavaScript, React, TypeScript, Node.js, Agile methodologies, Docker, MySQL, SQL Server'
      },
      {
        description: 'Project Management: Project planning, forecasting, progress reporting, stakeholder collaboration'
      }
    ]
  },
  {
    title: 'Professional Experience',
    items: [
      {
        company: 'One Advanced',
        role: 'Principal Front-End Developer',
        duration: 'July 2021 – Present',
        description: 'Lead a team of front-end developers, fostering a collaborative environment to achieve high-quality deliverables and streamline workflows. Manage the full front-end development lifecycle, ensuring seamless coordination between design, development, and deployment stages. Conduct code reviews and provide guidance on best practices, enhancing team performance and code quality. Collaborate with stakeholders to design new features with a customer-centric approach, ensuring satisfaction and delight.'
      },
      {
        company: 'Pavers Shoes',
        role: 'JavaScript Developer',
        duration: 'February 2019 – July 2021',
        description: 'Designed and developed React-based tools to enhance business planning and administrative functions. Implemented best practices for front-end development, contributing to a culture of continuous improvement.'
      },
      {
        company: 'Killgerm',
        role: 'Front-End Web Developer',
        duration: 'August 2017 – February 2019',
        description: 'Developed bespoke React & TypeScript systems, improving operational efficiency for business processes.'
      },
      {
        company: 'Crocs',
        role: 'Store Manager',
        duration: 'July 2014 – August 2017'
      },
      {
        company: 'Tesco',
        role: 'Various customer service and leadership roles',
        duration: 'November 2006 – June 2014'
      }
    ]
  },
  {
    title: 'Education',
    items: [
      {
        description: 'BTEC ICT Practitioners Software Development.'
      },
      {
        description: '9 GCSE Grades A-C (including Maths, Physics, English Language, and English Literature).'
      },
      {
        description: 'ECDL – Pass.'
      },
      {
        description: 'Full valid driver’s licence'
      }
    ]
  },
  {
    title: 'References',
    items: [
      {
        description: 'Available upon request.'
      }
    ]
  }
]

export const Cv = (): JSX.Element => {
  return (
    <Container>
      <Grid container justifyContent='space-between' alignItems='center' sx={{ paddingTop: '1rem' }}>
        <Grid>
          <Typography level='h1' component='h1' style={{ color: 'var(--foreground' }} gutterBottom>
            Geoff Faiers
          </Typography>
          <Typography level='h4' component='h4' style={{ fontWeight: 500 }} color='neutral' gutterBottom>
            8 Segrave Walk, York, YO26 4UD / 07795102820 / geoff@gfaiers.com
          </Typography>
        </Grid>
        <Grid>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton href='https://www.linkedin.com/in/gfaiers/' component='a' target='_blank' aria-label='LinkedIn' size='lg' variant='solid'>
              <FontAwesomeIcon icon={faLinkedin}/>
            </IconButton>
            <IconButton href='https://github.com/geofffaiers' component='a' target='_blank' aria-label='GitHub' size='lg' variant='solid'>
              <FontAwesomeIcon icon={faGithub}/>
            </IconButton>
            <IconButton href='https://www.facebook.com/gfaiers' component='a' target='_blank' aria-label='Facebook' size='lg' variant='solid'>
              <FontAwesomeIcon icon={faFacebook}/>
            </IconButton>
            <IconButton href='mailto:geoff@gfaiers.com' component='a' aria-label='Email' size='lg' variant='solid'>
              <FontAwesomeIcon icon={faEnvelope}/>
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      {data.map((section, index) => (
        <Card key={index} variant='outlined' sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography level='h4' gutterBottom>
              {section.title}
            </Typography>
            {section.items.map((item, idx) => (
              <Grid container spacing={2} key={idx}>
                {item.company && (
                  <Grid xs={12}>
                    <Typography level='h4'>
                      {item.company}
                    </Typography>
                  </Grid>
                )}
                {item.role && (
                  <Grid xs={12}>
                    <Typography level='body-md'>{item.role}</Typography>
                  </Grid>
                )}
                {item.duration && (
                  <Grid xs={12}>
                    <Typography level='body-md' color='neutral'>
                      {item.duration}
                    </Typography>
                  </Grid>
                )}
                {item.description && (
                  <Grid xs={12}>
                    <Typography level='body-md'>{item.description}</Typography>
                  </Grid>
                )}
                {item.institution && (
                  <Grid xs={12}>
                    <Typography level='h4' component='h4'>
                      {item.institution}
                    </Typography>
                  </Grid>
                )}
                {item.degree && (
                  <Grid xs={12}>
                    <Typography level='body-md'>{item.degree}</Typography>
                  </Grid>
                )}
                {item.skill && (
                  <Grid xs={12}>
                    <Typography level='body-md'>
                      {item.skill}: {item.level}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ))}
          </CardContent>
        </Card>
      ))}
    </Container>
  )
}
