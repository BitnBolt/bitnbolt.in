import { companyInfo, formatCompanyAddress } from '@/lib/company';

type CompanyContactDetailsProps = {
  variant?: 'light' | 'dark';
};

export default function CompanyContactDetails({ variant = 'light' }: CompanyContactDetailsProps) {
  const cardClass =
    variant === 'light'
      ? 'bg-[#f8fafd] border border-gray-100 rounded-xl p-4'
      : 'bg-white/5 border border-white/10 rounded-xl p-4';

  const labelClass =
    variant === 'light'
      ? 'text-[11px] font-semibold uppercase tracking-wide text-gray-400'
      : 'text-[11px] font-semibold uppercase tracking-wide text-gray-500';

  const valueClass =
    variant === 'light' ? 'text-sm text-gray-700 leading-snug' : 'text-sm text-gray-300 leading-snug';

  const linkClass = 'hover:text-[#1E88E5] transition-colors';

  const rows = [
    {
      label: 'Company',
      value: (
        <>
          {companyInfo.legalName}
          <span className="text-gray-500"> · {companyInfo.constitution}</span>
        </>
      ),
    },
    {
      label: 'Address',
      value: formatCompanyAddress(false),
    },
    {
      label: 'GSTIN',
      value: <span className="font-mono text-[13px] tracking-wide">{companyInfo.gstin}</span>,
    },
    {
      label: 'Email',
      value: (
        <span className="flex flex-wrap gap-x-3 gap-y-0.5">
          <a href={`mailto:${companyInfo.emails.info}`} className={linkClass}>
            {companyInfo.emails.info}
          </a>
          <a href={`mailto:${companyInfo.emails.support}`} className={linkClass}>
            {companyInfo.emails.support}
          </a>
        </span>
      ),
    },
    {
      label: 'Hours',
      value: companyInfo.businessHours.join(' · '),
    },
  ];

  return (
    <div className={cardClass}>
      <dl className="divide-y divide-gray-200/80">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[72px_1fr] sm:grid-cols-[80px_1fr] gap-2 py-2.5 first:pt-0 last:pb-0">
            <dt className={labelClass}>{row.label}</dt>
            <dd className={valueClass}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
