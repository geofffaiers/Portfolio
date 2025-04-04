import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const typographyVariants = cva(
    '',
    {
        variants: {
            variant: {
                h1:
                    'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
                h2:
                    'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                h3:
                    'scroll-m-20 text-2xl font-semibold tracking-tight',
                h4:
                    'scroll-m-20 text-xl font-semibold tracking-tight',
                p: 'leading-7',
                blockquote: 'mt-6 border-l-2 pl-6 italic',
                ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
                ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
                code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
            }
        },
        defaultVariants: {
            variant: 'p'
        },
    }
);

type VariantElementMap = {
    h1: HTMLHeadingElement;
    h2: HTMLHeadingElement;
    h3: HTMLHeadingElement;
    h4: HTMLHeadingElement;
    p: HTMLParagraphElement;
    blockquote: HTMLQuoteElement;
    ul: HTMLUListElement;
    ol: HTMLOListElement;
    code: HTMLElement;
};

export interface TypographyProps<T extends keyof VariantElementMap>
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
        variant?: T;
}

const Typography = React.forwardRef(
    <T extends keyof VariantElementMap = 'p'>(
        { className, variant, ...props }: TypographyProps<T>,
        ref: React.ForwardedRef<VariantElementMap[T]>
    ) => {
        const Comp = (variant ?? 'p') as React.ElementType;
        return (
            <Comp
                className={cn(typographyVariants({ variant }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Typography.displayName = 'Typography';

export { Typography, typographyVariants };
