/** Joins truthy class names: cn('a', cond && 'b') -> 'a b' */
export const cn = (...classes) => classes.filter(Boolean).join(' ');
