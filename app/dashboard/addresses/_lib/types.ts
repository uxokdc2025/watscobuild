export type AddressKind = "user" | "account";

export type Address = {
  id: string;
  kind: AddressKind;
  label: string;
  name: string;
  company: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
  accountId?: string;
  note?: string;
};

export type AddressFormData = {
  label: string;
  name: string;
  company: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

export type AddressFormErrors = Partial<Record<keyof AddressFormData, string>>;
