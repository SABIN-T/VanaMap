import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    className,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'} btn-${size} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};
