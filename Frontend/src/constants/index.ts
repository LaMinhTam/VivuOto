export const RENT_REQUEST_OPTIONS = [
  { label: "account.my_trips.all", value: "" },
  { label: "account.my_trips.approved", value: "APPROVED" },
  { label: "account.my_trips.pending", value: "PENDING" },
  { label: "account.my_trips.rejected", value: "REJECTED" },
];
export enum RENTAL_SYSTEM_MESSAGE {
  LESSEE_SIGNED_CONTRACT,
  NEW_RENTAL_REQUEST,
  RENTAL_REQUEST_APPROVED,
  RENTAL_REQUEST_REJECTED,
}

export enum RENTAL_TYPE {
  RENTAL_CONTRACT,
  RENTAL_REQUEST,
}

export enum API_SYSTEM_MESSAGE {
  WRONG_PASSWORD,
  EMAIL_IN_USE,
  VERIFICATION_CODE_INVALID,
  EMAIL_ALREADY_VERIFIED,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_USED,
  CAR_NOT_FOUND,
  CAR_CREATE_SUCCESS,
  CAR_UPDATE_SUCCESS,
  CAR_DELETE_SUCCESS,
  INVOICE_NOT_FOUND,
  CONTRACT_NOT_FOUND,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CALLBACK_SUCCESS,
  PAYMENT_FAILED,
  PAYMENT_NOT_VALID,
  RENTAL_REQUEST_NOT_FOUND,
  USER_NOT_AUTHORIZED,
  USER_AUTHEN_SUCCESS,
  USER_NOT_VERIFIED,
  USER_NOT_FOUND,
  USER_VERIFY_SUCCESS,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_IDENTIFICATION_SUCCESS,
  USER_PHONE_UPDATE_SUCCESS,
  VEHICLE_HANDOVER_NOT_FOUND,
  VEHICLE_HANDOVER_CREATE_SUCCESS,
  VEHICLE_HANDOVER_APPROVE_BY_LESSEE_SUCCESS,
  VEHICLE_HANDOVER_UPDATE_BY_LESSEE_SUCCESS,
  VEHICLE_HANDOVER_APPROVE_BY_LESSOR_SUCCESS,
  SUCCESS,
  RENTAL_REJECT_SUCCESS,
  RENTAL_APPROVE_SUCCESS,
  RENTAL_CREATE_SUCCESS,
  REVIEW_CREATE_SUCCESS,
}

export const FUEL_OPTIONS = [
  {
    value: "GASOLINE",
    label: "Xăng",
  },
  {
    value: "DIESEL_OIL",
    label: "Dầu",
  },
  {
    value: "ELECTRICITY",
    label: "Điện",
  },
];

export const EN_FUEL_OPTIONS = [
  {
    value: "GASOLINE",
    label: "Gasoline",
  },
  {
    value: "DIESEL_OIL",
    label: "Diesel",
  },
  {
    value: "ELECTRICITY",
    label: "Electricity",
  },
];

export const TRANSMISSION_OPTIONS = [
  {
    value: "MANUAL",
    label: "Số sàn",
  },
  {
    value: "AUTO",
    label: "Tự động",
  },
];

export const EN_TRANSMISSION_OPTIONS = [
  {
    value: "MANUAL",
    label: "Manual",
  },
  {
    value: "AUTO",
    label: "Automatic",
  },
];
