import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'We could not find anything matching your request.',
  actionText,
  actionLink,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-raised text-muted">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-[18px] font-medium text-ink">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-5 text-muted">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="ui-btn ui-btn-primary mt-6">
          {actionText}
        </Link>
      )}
    </div>
  );
}
