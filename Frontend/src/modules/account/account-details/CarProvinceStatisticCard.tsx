import { useEffect, useState } from "react";
import CustomPieChart from "../../../components/charts/CustomPieChart";
import { ICarStatisticsByProvince } from "../../../store/stats/types";
import { fetchStatisticCarByProvince } from "../../../store/stats/handlers";
import { useTranslation } from "react-i18next";
import { Empty, Spin } from "antd";

const CarProvinceStatisticCard = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ICarStatisticsByProvince[]>([] as ICarStatisticsByProvince[]);
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await fetchStatisticCarByProvince();
            if (response?.success) {
                setData(response?.data as ICarStatisticsByProvince[]);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return (
        <Spin spinning={loading}>
            {data?.length > 0 ? <CustomPieChart data={data} title={t("stat.admin.carTitle")} /> : <Empty />}
        </Spin>
    );
};

export default CarProvinceStatisticCard;