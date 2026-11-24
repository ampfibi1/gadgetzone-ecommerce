import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SectionHeading({
  index,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        {index && (
          <div className="ui-kicker">
            <span className="ui-mark" />
            {index}
          </div>
        )}
        <h2 className="mt-2 text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[28px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-[13px] leading-5 text-muted">{description}</p>
        )}
      </div>

      {action && (
        <Link
          to={action.to}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink transition-colors hover:text-ember"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
