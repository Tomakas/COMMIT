export const ContactHeaders = [
  { title: 'table.headers.name', key: 'name', required: true, mobileMain: 'left', visible: true, sortable: false },
  { title: 'table.headers.shortName', key: 'shortName', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.address', key: 'address', minWidth: '350px', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.email', key: 'email', minWidth: '220px', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.phone', key: 'phone', minWidth: '160px', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.totalSales', key: 'total', align: 'end', required: false, mobileMain: 'right', mobileListLeft: false, visible: true, sortable: false },
  { title: 'table.headers.customId', key: 'customId', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.loyaltyPoints', key: 'loyaltyPoints', align: 'end', required: false, mobileListLeft: false, visible: true, sortable: false },
];

export const ContactModel = () => ({
  subjectId: null,
  name: '',
  shortName: '',
  address: '',
  email: '',
  phone: '',
  total: '0,00 Kč',
  customId: '',
  loyaltyPoints: '0',
});