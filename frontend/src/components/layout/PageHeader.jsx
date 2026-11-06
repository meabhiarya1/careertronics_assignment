import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

export function PageHeader({ breadcrumbs = [], title, description }) {
  return (
    <div>
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <Fragment key={crumb}>
                  <li aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-indigo-600' : undefined}>
                    {crumb}
                  </li>
                  {!isLast && (
                    <li aria-hidden="true">
                      <ChevronRight className="size-3.5 text-slate-400" />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>
        </nav>
      )}
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 max-w-2xl text-sm text-slate-500">{description}</p>}
    </div>
  );
}
