export const ENDPOINTS = {
    // [USER]
    USER_STATISTICS_CONTRACTS: '/stats/rental-contract-summary',
    USER_STATISTICS_CARS: '/stats/car-statistics',

    // [ADMIN]
    ADMIN_STATISTICS_INVOICES: '/stats/invoice-summary',
    ADMIN_STATISTICS_CONTRACTS: '/stats/user-contract-summary',
    ADMIN_STATISTICS_CARS: '/stats/car-statistics',
    ADMIN_STATISTICS_CARS_BY_PROVINCE: '/stats/cars-by-province',
    ADMIN_STATISTICS_RENTAL_VOLUME: '/stats/monthly-rental-volume'
}

export const ContractParams = {
    startDate: '',
    endDate: '',
}

export const ContractUserParams = {
    startDate: '',
    endDate: '',
    filterByLessor: '', // [true, false]
    sortBy: 'totalContracts', // [totalContracts, ...]
    sortOrder: '' // [asc, desc]
}

export const CarStatisticsParams = {
    startDate: '',
    endDate: '',
    owner: '',
    sortBy: 'totalContracts',
    sortOrder: '',
}

export const InvoiceSummaryParams = {
    startDate: '',
    endDate: '',
    type: '', // [RENT, TOKEN]
}

export const RentalVolumeParams = {
    startDate: '',
    endDate: '',
    timeInterval: 'DAY' // [DAY, WEEK, MONTH, QUARTER, YEAR]
}