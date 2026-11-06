import { focusRing } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-500',
  secondary: 'bg-white text-slate-700 shadow-xs ring-1 ring-inset ring-slate-200 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

const SIZES = {
  sm: 'h-8 gap-1.5 px-2.5 text-xs',
  md: 'h-10 gap-2 px-3.5 text-sm',
};

export function Button({ variant = 'secondary', size = 'md', type = 'button', className, ...props }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        focusRing,
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
