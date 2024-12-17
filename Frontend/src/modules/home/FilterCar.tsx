import { Button, DatePicker, Select, Typography } from "antd";
import LocationIcon from "../../components/icons/LocationIcon";
import provinces from "../../config/provincesMockup";
import { useTranslation } from "react-i18next";
import { CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { convertDateToTimestamp } from "../../utils";
import { replaceSpacesWithUnderscores } from "../../utils/helper";

const { RangePicker } = DatePicker;

const FilterCar = () => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(2, 'day'));
    const [provinceId, setProvinceId] = useState(1);
    const currentLanguage = i18n.language;
    const provinceOptions = provinces.map(province => ({
        value: province.id,
        label: currentLanguage === "en" ? province.enName : province.vnName,
    }));
    const handleFilterCars = () => {
        const province = provinces.find(p => p.id === provinceId);
        const startDateTimestamp = startDate ? convertDateToTimestamp(startDate.toDate()?.toDateString()) : null;
        const endDateTimestamp = endDate ? convertDateToTimestamp(endDate.toDate()?.toDateString()) : null;
        navigate(`/cars/filter?startDate=${startDateTimestamp}&endDate=${endDateTimestamp}&province=${replaceSpacesWithUnderscores(province?.enName ?? "")}`);
    }
    return (
        <div className="w-full max-w-[1000px] h-full bg-lite shadow-sm p-5 mt-10 mx-auto rounded-lg">
            <div className="flex items-center justify-center">
                <div className="pr-4 border-r border-r-text4">
                    <div className="flex items-center justify-start gap-x-2">
                        <LocationIcon />
                        <Typography.Text className="text-lg">{t("common.location")}</Typography.Text>
                    </div>
                    {/* render select option with provinces */}
                    <Select
                        showSearch
                        placeholder={t("common.provinceSelect")}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={provinceId}
                        onChange={(value) => setProvinceId(value)}
                        options={provinceOptions}
                        className="w-full min-w-[300px] mt-2"
                        placement="bottomLeft"
                    />
                </div>
                <div className="flex items-center justify-between flex-1 pl-4">
                    <div>
                        <div className="flex items-center justify-start mb-2 gap-x-2">
                            <CalendarOutlined className="text-2xl" />
                            <Typography.Text className="text-lg">{t("common.rentTime")}</Typography.Text>
                        </div>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            defaultValue={[dayjs(), dayjs().add(2, 'day')]}
                            value={[startDate, endDate]}
                            onChange={(dates) => {
                                if (dates && dates[0] && dates[1]) {
                                    setStartDate(dates[0]);
                                    setEndDate(dates[1]);
                                } else {
                                    setStartDate(null);
                                    setEndDate(null);
                                }
                            }}
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day');
                            }}
                        />
                    </div>
                    <Button type="primary" onClick={handleFilterCars}>{t("common.find")}</Button>
                </div>
            </div>
        </div>
    );
};

export default FilterCar;