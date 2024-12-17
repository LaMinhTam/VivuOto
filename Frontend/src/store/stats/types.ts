export interface IUserContractSummary {
    name: string;
    total_contracts: number;
    total_value: number;
}

export interface IStatisticInvoice {
    day_label: string;
    type: string;
    total_invoices: number;
    total_amount: number;
}

export interface IRentalContractSummary {
    day_label: string;
    status: string;
    total_contracts: number;
    total_value: number;
}

export interface ICarStatistics {
    car_id: string;
    car_name: string;
    total_contracts: number;
    total_rental_value: number;
}

export interface ICarStatisticsByProvince {
    province: string;
    car_count: number;
}

export interface IRentalVolume {
    year_month: string;
    total_contracts: number;
    total_free_cars: number;
    total_rented_cars: number;
    total_income: number;
}

export interface StatisticState {
    userContractSummary: IUserContractSummary[];
    statisticInvoice: IStatisticInvoice[];
    rentalContractSummary: IRentalContractSummary[];
    carStatistics: ICarStatistics[];
    carStatisticsByProvince: ICarStatisticsByProvince[];
    loading: boolean;
    error: string | null;
}

export interface ContractParamsType {
    startDate: string;
    endDate: string;
    lessee?: string;
    lessor?: string;
}

export interface ContractUserParamsType {
    startDate: string;
    endDate: string;
    filterByLessor: string; // [true false]
    sortBy: string; // [totalContracts, ...]
    sortOrder: string // [asc, desc]
}

export interface CarStatisticsParamsType  {
    startDate: string;
    endDate: string;
    owner: string;
    sortBy: string;
    sortOrder: string;
}

export interface InvoiceSummaryParamsType  {
    startDate: string;
    endDate: string;
    type: string; // [RENT, TOKEN]
}

export interface RentalVolumeParamsType {
    startDate: string;
    endDate: string;
    timeInterval: string; // [DAY, WEEK, MONTH, QUARTER, YEAR];
}
