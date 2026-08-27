import type { Address, AddressFormData, AddressFormErrors } from "./types";

export const ACCOUNT_ID = "#erp|1HOM|509973";

export const ACCOUNT_ADDRESSES: Address[] = [
  {
    id: "acct-1",
    kind: "account",
    label: "Manchester branch — will call",
    name: "David Whiteside",
    company: "Homans Associates — Acct 509973",
    street1: "613 Main Street",
    city: "Williston",
    state: "VT",
    zip: "05495",
    phone: "+1 978 657 8990",
    isDefault: true,
    accountId: ACCOUNT_ID,
    note: "All cash sales are final. Will-call pickup only.",
  },
  {
    id: "acct-2",
    kind: "account",
    label: "Manchester branch — ship to",
    name: "David Whiteside",
    company: "Homans Associates — Acct 509973",
    street1: "613 Main Street",
    street2: "Receiving Dock B",
    city: "Manchester",
    state: "NH",
    zip: "03102",
    phone: "+1 978 657 8990",
    isDefault: false,
    accountId: ACCOUNT_ID,
    note: "All cash sales are final. Dock hours 6am–3pm.",
  },
  {
    id: "acct-3",
    kind: "account",
    label: "Nashua job site",
    name: "David Whiteside",
    company: "Whiteside Mechanical LLC",
    street1: "1248 Daniel Webster Hwy",
    city: "Nashua",
    state: "NH",
    zip: "03060",
    phone: "+1 978 657 8990",
    isDefault: false,
    accountId: ACCOUNT_ID,
  },
];

export const EMPTY_FORM: AddressFormData = {
  label: "",
  name: "",
  company: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
};

export function validateAddressForm(form: AddressFormData): AddressFormErrors {
  const e: AddressFormErrors = {};
  if (!form.label.trim()) e.label = "Add a label so you can spot this address at checkout.";
  if (!form.name.trim()) e.name = "Enter the recipient name.";
  if (!form.street1.trim()) e.street1 = "Enter the street address.";
  if (!form.city.trim()) e.city = "Enter the city.";
  if (!form.state.trim()) e.state = "Enter the state.";
  if (!form.zip.trim()) e.zip = "Enter the ZIP code.";
  else if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) e.zip = "Enter a 5-digit ZIP.";
  if (!form.phone.trim()) e.phone = "Enter a phone number for delivery updates.";
  return e;
}
