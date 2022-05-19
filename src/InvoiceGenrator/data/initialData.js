// import { ProductLine, Invoice } from './types'

export const initialProductLine = {
  description: "",
  quantity: "0",
  rate: "0.00",
};

export const initialInvoice = {
  logo: "",
  logoWidth: 100,
  title: "INVOICE",
  companyName: "",
  name: "",
  companyAddress: "",
  companyAddress2: "",
  companyCountry: "India",
  billTo: "Bill To:",
  clientCompanyName: "",
  clientName: "",
  clientAddress: "",
  clientAddress2: "",
  clientCountry: "India",
  invoiceTitleLabel: "Invoice#",
  invoiceTitle: "",
  invoiceDateLabel: "Invoice Date",
  invoiceDate: "",
  invoiceDueDateLabel: "Due Date",
  invoiceDueDate: "",
  productLineDescription: "Item Description",
  productLineQuantity: "Qty",
  productLineQuantityRate: "Rate",
  productLineQuantityAmount: "Amount",
  productLines: [
    // {
    //   description: 'Brochure Design',
    //   quantity: '2',
    //   rate: '100.00',
    // },
    { ...initialProductLine },
    // { ...initialProductLine },
  ],
  subTotalLabel: "Sub Total",
  taxLabel: "Sale Tax (10%)",
  totalLabel: "TOTAL",
  currency: "$",
  notesLabel: "Notes",
  notes: "",
  termLabel: "Terms & Conditions",
  term: "",
};
