export const ENDPOINTS = {
  // [REQUEST]
  RENT_REQUEST: "/rental-requests/rent",
  LESSOR_APPROVE_REQUEST: "/rental-requests/approve",
  LESSOR_REJECT_REQUEST: "/rental-requests/reject",
  GET_LESSEE_REQUESTS: "/rental-requests/lessee",
  GET_LESSOR_REQUESTS: "/rental-requests/lessor",
  GET_REQUEST_BY_ID: (id: string) => `/rental-requests/${id}`,
  // [CONTRACT]
  GET_LESSEE_CONTRACTS: "/rental-contracts/lessee",
  GET_LESSOR_CONTRACTS: "/rental-contracts/lessor",
  GET_CONTRACT_BY_ID: (id: string) => `/rental-contracts/${id}`,
  LESSEE_APPROVE_CONTRACT: "/rental-contracts/lessee-approve",
  // [HANDOVER]
  CREATE_VEHICLE_HANDOVER: "/vehicle-handover",
  LESSEE_APPROVE_HANDOVER: (id: string) =>
    `/vehicle-handover/${id}/approve-lessee`,
  LESSEE_RETURN_VEHICLE: (id: string) =>
    `/vehicle-handover/${id}/return`,
  LESSOR_APPROVE_RETURN: (id: string) =>
    `/vehicle-handover/${id}/approve-lessor`,
  GET_VEHICLE_HANDOVER_BY_CONTRACT_ID: (id: string) =>
    `/vehicle-handover/rental-contract/${id}`,
  // [REVIEW]
  CREATE_REVIEW: "/reviews",
  GET_REVIEW_BY_CAR_ID: (id: string) => `/reviews/car/${id}`,
  POST_HANDOVER_ISSUE: (id: string) =>
    `/rental-contracts/${id}/post-handover`,
};

export const RentalRequestParams = {
  sortDescending: "true",
  page: "0",
  size: "10",
  status: "",
};

export const ContractParams = {
  sortDescending: "true",
  page: "0",
  size: "10",
};
