import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { inputBase } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';

const SIZES = {
  sm: 'h-8 min-w-16 pr-8 pl-2.5 text-xs',
  md: 'h-10 pr-9 pl-3',
};

/** Native <select> (accessible + mobile-friendly) styled to match the inputs. */
export function SelectField({ label, value, options, onChange, hideLabel = true, size = 'md', className }) {
  const id = useId();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor={id}
        className={hideLabel ? 'sr-only' : 'text-sm whitespace-nowrap text-slate-500'}
      >
        {label}
      </label>
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(inputBase, 'cursor-pointer appearance-none font-medium text-slate-700', SIZES[size])}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}
