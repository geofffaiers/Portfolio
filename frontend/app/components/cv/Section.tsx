import { CvHeader } from '@/app/models'
import { Grid, Typography } from '@mui/joy'
import { useMemo } from 'react'

interface Props {
  section: CvHeader
}

export const Section = ({ section }: Props): JSX.Element => {

  const getDuration = useMemo(() => (startDate: Date | undefined, endDate: Date | null | undefined): string | undefined => {
    if (startDate === undefined || endDate === undefined) {
      return undefined
    }
    if (endDate == null) {
      return `${startDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} – Present`
    } else {
      return `${startDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} – ${endDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
    }
  }, [])

  return (
    <>
      <Typography level='h4' gutterBottom>
        {section.title}
      </Typography>
      {section.items.map((item, idx) => {
        const duration: string | undefined = getDuration(item.startDate, item.endDate)
        return (
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
            {duration != null && (
              <Grid xs={12}>
                <Typography level='body-md' color='neutral'>
                  {duration}
                </Typography>
              </Grid>
            )}
            {item.description && (
              <Grid xs={12}>
                <Typography level='body-md'>{item.description}</Typography>
              </Grid>
            )}
          </Grid>
        )
      })}
    </>
  )
}
