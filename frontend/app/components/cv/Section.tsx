import { CvHeader } from "@/app/models"
import { Grid, Typography } from "@mui/joy"

interface Props {
  section: CvHeader
}

export const Section = ({ section }: Props): JSX.Element => {
  return (
    <>
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
        </Grid>
      ))}
    </>
  )
}
