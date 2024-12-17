export const ENDPOINTS = {
  CREATE_CAR: "/cars",
  FIND_CAR_BY_ID: (id: string) => `/cars/${id}`,
  UPDATE_CAR: (id: string) => `/cars/${id}`,
  DELETE_CAR: (id: string) => `/cars/${id}`,
  AUTOCOMPLETE: (query: string, province: string) =>
    `/cars/autocomplete?query=${query}&province=${province}`,
  SEARCH: `/cars/search`,
  MY_CARS: `/cars/owned`,
};

export const QuerySearchCar = {
  query: "",
  province: "",
  page: 1,
  size: 10,
  transmission: "MANUAL,AUTO",
  seats: "",
  minConsumption: 0,
  maxConsumption: 0,
  maxRate: "",
  rentalStartDate: "",
  rentalEndDate: "",
  rating: "",
};

export const QueryCarOwner = {
  page: "1",
  size: "10",
  sortDescending: "true",
  status: "",
  searchQuery: "",
};
