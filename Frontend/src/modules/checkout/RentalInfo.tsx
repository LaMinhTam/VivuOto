import { Col, DatePicker, Row, Typography } from "antd";
import LocationSelect from "../../components/common/LocationSelect";
import { Dayjs } from "dayjs"; // Import dayjs
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

const RentalInfo = ({
    onChange,
    setProvince
}: {
    onChange: (dates: [Dayjs | null, Dayjs | null] | null) => void
    setProvince: (value: string) => void
}) => {
    const { t } = useTranslation()
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Typography.Title className="m-0" level={5}>
                        {t("rent.rentInfo")}
                    </Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">{t("rent.rentDate.required")}</Typography.Text>
                </div>
                <Typography.Text className="text-sm text-custom-blue">{t("rent.step")} 2 {t("rent.of")} 4</Typography.Text>
            </div>
            <Row gutter={[32, 24]}>
                <Col span={12}>
                    <Typography.Text className="font-medium">{t("rent.location")}</Typography.Text>
                    <LocationSelect className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" setProvince={setProvince}></LocationSelect>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">{t("rent.rentTime")}</Typography.Text>
                    <RangePicker showTime className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" onChange={onChange}></RangePicker>
                </Col>
            </Row>
        </div>
    );
};

export default RentalInfo;