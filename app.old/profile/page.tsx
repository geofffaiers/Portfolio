'use client'
import { Typography } from '@mui/joy'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ProfileForm } from './components/ProfileForm'
import { usePageContext } from '../context'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ProfilePage (): JSX.Element {
  const { loggedInUser } = usePageContext()
  const router = useRouter()

  const handleBackClick = () => {
    router.push('/')
  }

  useEffect(() => {
    if (!loggedInUser) {
      router.push('/')
    }
  }, [loggedInUser, router])

  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div className='w-full max-w-md bg-white bg-opacity-90 rounded-lg'>
          <div className='p-4 border-b border-gray-300'>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                aria-label='back'
                onClick={handleBackClick}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <Typography level='h4' component='h1'>
                User Profile
              </Typography>
            </div>
          </div>
          <ProfileForm />
        </div>
      </div>
    </>
  )
}
