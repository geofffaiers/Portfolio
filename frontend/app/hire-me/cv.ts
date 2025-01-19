import { CvHeader } from "./types"

export const cv: CvHeader[] = [
  {
    title: "Professional Summary",
    items: [
      {
        description: `With over 15 years of experience in development, I specialize in technologies like Next.js, React, TypeScript, Node.js, 
                      and Java, leading teams to deliver high-quality, scalable solutions. Currently, as a Principal Front-End Developer at 
                      One Advanced, I manage the UX/UI design and implementation for our flagship healthcare platform, ensuring exceptional 
                      performance and user satisfaction. I am eager to bring my expertise and passion for continuous improvement to 
                      a new team, leveraging my technical skills to drive success and innovation.`
      }
    ]
  },
  {
    title: "Technical Skills",
    items: [
      {
        description: "Technical Proficiency: JavaScript, TypeScript, Java, React, Node.js, Docker, MySQL, SQL Server"
      },
      {
        description: "Project Management: Project planning, forecasting, progress reporting, stakeholder collaboration, agile methodologies"
      },
      {
        description: "Leadership & Management: Team performance management, line management, coaching, mentoring"
      }
    ]
  },
  {
    title: "Professional Experience",
    items: [
      {
        company: "One Advanced",
        role: "Principal Front-End Developer",
        startDate: new Date("2021-07-01"),
        endDate: new Date("2024-12-09"),
        description: "Lead a team of front-end developers, fostering a collaborative environment to achieve high-quality deliverables and streamline workflows. Manage the full front-end development lifecycle, ensuring seamless coordination between design, development, and deployment stages. Conduct code reviews and provide guidance on best practices, enhancing team performance and code quality. Collaborate with stakeholders to design new features with a customer-centric approach, ensuring satisfaction and delight."
      },
      {
        company: "Pavers Shoes",
        role: "JavaScript Developer",
        startDate: new Date("2019-02-01"),
        endDate: new Date("2021-07-01"),
        description: "Designed and developed React-based tools to enhance business planning and administrative functions. Implemented best practices for front-end development, contributing to a culture of continuous improvement."
      },
      {
        company: "Killgerm",
        role: "Front-End Web Developer",
        startDate: new Date("2017-08-01"),
        endDate: new Date("2019-02-01"),
        description: "Developed bespoke React & TypeScript systems, improving operational efficiency for business processes."
      },
      {
        company: "Crocs",
        role: "Store Manager",
        startDate: new Date("2014-07-01"),
        endDate: new Date("2017-08-01")
      },
      {
        company: "Tesco",
        role: "Various customer service and leadership roles",
        startDate: new Date("2006-11-01"),
        endDate: new Date("2014-06-01")
      }
    ]
  },
  {
    title: "Education",
    items: [
      {
        description: "BTEC ICT Practitioners Software Development."
      },
      {
        description: "9 GCSE Grades A-C (including Maths, Physics, English Language, and English Literature)."
      },
      {
        description: "ECDL: Pass."
      },
      {
        description: "Full valid driver’s licence"
      }
    ]
  }
]