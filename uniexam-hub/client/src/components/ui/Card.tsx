import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = ({ hover = false, className, children, ...props }: CardProps) => (
  <div className={clsx(hover ? 'card-hover' : 'card', className)} {...props}>
    {children}
  </div>
);

export default Card;
