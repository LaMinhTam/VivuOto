import { AxiosResponse } from "axios";
import { axiosPrivate } from "../../apis/axios";
import { ENDPOINTS } from "./models";
import { CarStatisticsParamsType, ContractParamsType, ContractUserParamsType, ICarStatistics, ICarStatisticsByProvince, InvoiceSummaryParamsType, IRentalContractSummary, IRentalVolume, IStatisticInvoice, IUserContractSummary, RentalVolumeParamsType } from "./types";
import { setCarStatistics, setCarStatisticsByProvince, setStatisticInvoice, setUserContractSummary } from "./reducers";

interface IStatisticInvoiceResponse {
    code: number;
    data: IStatisticInvoice[];
}

interface IUserContractSummaryResponse {
    code: number;
    data: IUserContractSummary[];
}
interface ICarStatisticResponse {
    code: number;
    data: ICarStatistics[];
}
interface ICarStatisticByProvinceResponse {
    code: number;
    data: ICarStatisticsByProvince[];
}

interface IRentalVolumeResponse {
    code: number;
    data: IRentalVolume[]
}

export const fetchStatisticInvoice = async (params: InvoiceSummaryParamsType) => {
    try {
        const response: AxiosResponse<IStatisticInvoiceResponse> = await axiosPrivate.get(ENDPOINTS.ADMIN_STATISTICS_INVOICES, { params });
        if(response?.data?.code === 200) {
            setStatisticInvoice(response?.data?.data);
            return {success: true, data: response?.data?.data};
        }
    } catch (error) {
        const typedError = error as Error;
        console.log("fetchStatisticInvoice ~ typedError:", typedError)
        return {success: false, data: []};
    }
}

export const fetchUserStatisticContract = async (params: ContractUserParamsType) => {
    try {
        const response: AxiosResponse<IUserContractSummaryResponse> = await axiosPrivate.get(ENDPOINTS.ADMIN_STATISTICS_CONTRACTS, { params });
        if(response?.data?.code === 200) {
            setUserContractSummary(response?.data?.data);
            return {success: true, data: response?.data?.data};
        }
    } catch (error) {
        const typedError = error as Error;
        console.log("fetchUserStatisticInvoice ~ typedError:", typedError)
        return {success: false, data: []};
    }
}

export const fetchCarStatistics = async (params: CarStatisticsParamsType) => {
    try {
        const response: AxiosResponse<ICarStatisticResponse> = await axiosPrivate.get(ENDPOINTS.ADMIN_STATISTICS_CARS, { params });
        if(response?.data?.code === 200) {
            setCarStatistics(response?.data?.data);
            return {success: true, data: response?.data?.data};
        }
    } catch (error) {
        console.log("fetchCarStatistics ~ error:", error)
        return {success: false, data: []};
    }
}

export const fetchRentalContractSummary = async (params: ContractParamsType) => {
    try {
        const response: AxiosResponse<IRentalContractSummary[]> = await axiosPrivate.get(ENDPOINTS.USER_STATISTICS_CONTRACTS, { params });
        return {success: true, data: response?.data};
    } catch (error) {
        console.log("fetchRentalContractSummary ~ error:", error)
        return {success: false, data: []};
    }
}

export const fetchStatisticCarByProvince = async () => {
    try {
        const response: AxiosResponse<ICarStatisticByProvinceResponse> = await axiosPrivate.get(ENDPOINTS.ADMIN_STATISTICS_CARS_BY_PROVINCE);
        if(response?.data?.code === 200) {
            setCarStatisticsByProvince(response?.data?.data);
            return {success: true, data: response?.data?.data};
        }
    } catch (error) {
        console.log("fetchStatisticCarByProvince ~ error:", error)
        return {success: false, data: []};
    }
}

export const fetchRentalVolume = async (params: RentalVolumeParamsType) => {
    try {
        const response: AxiosResponse<IRentalVolumeResponse> = await axiosPrivate.get(ENDPOINTS.ADMIN_STATISTICS_RENTAL_VOLUME, { params });
        if(response?.data?.code === 200) {
            return {success: true, data: response?.data?.data};
        }
    } catch (error) {
        console.log("fetchRentalVolume ~ error:", error)
        return {success: false, data: []};
    }
}