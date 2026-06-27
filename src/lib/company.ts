export const companyInfo = {
  legalName: 'BITNBOLT PRIVATE LIMITED',
  tradeName: 'BITNBOLT PRIVATE LIMITED',
  constitution: 'Private Limited Company',
  gstin: '10AAOCB5823B1Z7',
  emails: {
    info: 'info@bitnbolt.in',
    support: 'support@bitnbolt.in',
  },
  address: {
    buildingNo: 'PANCH-NOORPUR',
    premises: 'NOORPUR',
    street: 'NATHNAGAR',
    city: 'Bhagalpur',
    district: 'Bhagalpur',
    state: 'Bihar',
    pinCode: '812006',
  },
  businessHours: [
    'Monday – Friday: 9:00 AM – 6:00 PM IST',
    'Saturday: 10:00 AM – 4:00 PM IST',
    'Sunday: Closed',
  ],
} as const;

export function formatCompanyAddress(multiline = true): string {
  const lines = formatCompanyAddressLines();
  if (multiline) {
    return lines.join('\n');
  }
  return lines.join(', ');
}

export function formatCompanyAddressLines(): string[] {
  const { buildingNo, premises, street, city, district, state, pinCode } = companyInfo.address;
  return [
    `${buildingNo}, ${premises}`,
    street,
    `${city}, ${district}`,
    `${state} – ${pinCode}`,
  ];
}
