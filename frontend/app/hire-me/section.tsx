'use client';

import React from 'react';
import { CvHeader } from './types';
import { JSX, useMemo } from 'react';

type Props = {
  section: CvHeader;
}

export const Section = ({ section }: Props): JSX.Element => {

    const getDuration = useMemo(() => (startDate: Date | undefined, endDate: Date | null | undefined): string | undefined => {
        if (startDate === undefined || endDate === undefined) {
            return undefined;
        }
        if (endDate == null) {
            return `${startDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} – Present`;
        } else {
            return `${startDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} – ${endDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
        }
    }, []);

    return (
        <div className='mb-8'>
            <h4 className='text-2xl font-bold mb-4'>
                {section.title}
            </h4>
            {section.items.map((item, idx) => {
                const duration: string | undefined = getDuration(item.startDate, item.endDate);
                const isLastItem = idx === section.items.length - 1;
                return (
                    <div className={isLastItem ? '' : 'mb-6'} key={idx}>
                        {item.company && (
                            <div className='text-xl font-semibold'>
                                {item.company}
                            </div>
                        )}
                        {item.role && (
                            <div className='text-lg'>
                                {item.role}
                            </div>
                        )}
                        {duration != null && (
                            <div className='text-md text-gray-500'>
                                {duration}
                            </div>
                        )}
                        {item.description && (
                            <div className='text-md'>
                                {item.description}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
