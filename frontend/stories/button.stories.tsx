import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/button';
import { Heart } from 'lucide-react';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'warning', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: { type: 'select' },
            options: ['default', 'sm', 'lg', 'icon'],
        },
        asChild: { control: 'boolean' },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'default',
        children: 'Default',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        size: 'default',
        children: 'Warning',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        size: 'default',
        children: 'Destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        size: 'default',
        children: 'Outline',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        size: 'default',
        children: 'Secondary',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        size: 'default',
        children: 'Ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        size: 'default',
        children: 'Link',
    },
};

export const IconButton: Story = {
    args: {
        variant: 'default',
        size: 'icon',
        children: <Heart />,
    }
};

export const LoadingButton: Story = {
    args: {
        variant: 'default',
        size: 'default',
        children: 'Loading button',
        loading: true,
    }
};

