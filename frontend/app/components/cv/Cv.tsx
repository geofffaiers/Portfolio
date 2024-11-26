import { Container, Box, styled } from '@mui/joy'
import { CvHeader, User } from '../../models'
import { Section } from './Section'
import { Details } from './Details'
import { CallToAction } from './CallToAction'

const data: CvHeader[] = [
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

interface Props {
  loggedInUser: User | null
}

const OuterBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 100px);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.25rem;
`

const InnerBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  width: 100%;
  overflow: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

export const Cv = ({ loggedInUser }: Props): JSX.Element => {
  return (
    <Container style={{ height: '100vh', paddingTop: '100px' }}>
      <OuterBox>
        <Details loggedInUser={loggedInUser}/>
        <InnerBox>
          {data.map((section, index) => (
            <Section section={section} key={index}/>
          ))}
        </InnerBox>
        <CallToAction loggedInUser={loggedInUser}/>
      </OuterBox>
    </Container>
  )
}
