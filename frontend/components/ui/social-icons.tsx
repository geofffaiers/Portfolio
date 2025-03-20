import Link from 'next/link';
import { Button } from './button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { User } from '@/models';

type Props = {
    user?: User | null;
};

export const SocialIcons: React.FC<Props> = ({ user }) => {
    return (
        <div className='flex gap-2'>
            <Button asChild variant='ghost' size='icon'>
                <Link href='https://www.linkedin.com/in/gfaiers/' target='_blank' aria-label='LinkedIn'>
                    <FontAwesomeIcon icon={faLinkedin} />
                </Link>
            </Button>
            <Button asChild variant='ghost' size='icon'>
                <Link href='https://github.com/geofffaiers' target='_blank' aria-label='GitHub'>
                    <FontAwesomeIcon icon={faGithub} />
                </Link>
            </Button>
            <Button asChild variant='ghost' size='icon'>
                <Link href={`mailto:${user != null ? 'geoff' : 'info'}@gfaiers.com`} aria-label='Email'>
                    <FontAwesomeIcon icon={faEnvelope} />
                </Link>
            </Button>
        </div>
    );
};
