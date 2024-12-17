import { SecurityScanOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Row, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslation } from "react-i18next";

const Confirmation = ({ onRent, handleCheckboxChange }: {
    onRent: () => void,
    handleCheckboxChange: (e: CheckboxChangeEvent) => void
}) => {
    const { t } = useTranslation()
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Typography.Title className="m-0" level={5}>
                        {t("rent.confirmation")}
                    </Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">{t("rent.confirmation.desc")}</Typography.Text>
                </div>
                <Typography.Text className="text-sm text-custom-blue">{t("rent.step")} 4 {t("rent.of")} 4</Typography.Text>
            </div>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <div className="w-full h-[56px] rounded-lg bg-grayf6 mt-4 px-8 py-4 font-medium">
                        <Checkbox>{t("rent.agreeAdvertisement")}</Checkbox>
                    </div>
                </Col>
                <Col span={24}>
                    <div className="w-full h-[56px] rounded-lg bg-grayf6 mt-4 px-8 py-4 font-medium">
                        <Checkbox onChange={handleCheckboxChange}>{t("rent.agreeConditionAndSecurity")}</Checkbox>
                    </div>
                </Col>
            </Row>
            <Button type="primary" className="mt-8" onClick={onRent}>{t("rent.rentNow")}</Button>
            <div className="mt-8">
                <SecurityScanOutlined className="mb-4 text-2xl" />
                <Typography.Title level={5}>{t("rent.dataSecure")}</Typography.Title>
                <Typography.Text className="text-sm text-custom-blue">{t("rent.dataSecure.desc")}</Typography.Text>
            </div>
        </div>
    );
};

export default Confirmation;