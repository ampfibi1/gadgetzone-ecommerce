import React from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`mb-8 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        {eyebrow && (
          <div className="ui-kicker">
            <span className="ui-mark" />
            {eyebrow}
          </div>
        )}
        <h1 className="mt-2 text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
