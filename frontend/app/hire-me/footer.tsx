import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContactMe } from './contact-me';
import { User } from '@/models';

type Props = {
    user?: User | null;
};

export const Footer: React.FC<Props> = ({ user }) => {
    return (
        <footer className="sticky bottom-0 p-4 shadow-lg" style={{ backgroundColor: 'hsl(var(--background))' }}>
            <div className="flex flex-col items-center p-6 gap-4">
                <h4 className="text-xl font-medium text-center">
                    I am available for hire, let&#39;s work together!
                </h4>
                <div className="flex flex-wrap justify-center gap-4">
                    {user != null && (
                        <Button asChild variant="secondary" size="lg">
                            <Link target="_blank" href="/Geoffrey_Faiers.pdf" rel="noopener noreferrer">Download CV</Link>
                        </Button>
                    )}
                    {user == null && <ContactMe />}
                </div>
            </div>
        </footer>
    );
}
