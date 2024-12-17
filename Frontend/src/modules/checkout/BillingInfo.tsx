import { Col, Input, Row, Typography } from "antd";
import { IUser } from "../../store/auth/types";
import { useTranslation } from "react-i18next";

const BillingInfo = ({ userInfo }: {
    userInfo: IUser
}) => {
    const { t } = useTranslation();
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <Typography.Title className="m-0" level={5}>
                    {t("rent.paymentInfo")}
                </Typography.Title>
                <Typography.Text className="text-sm text-custom-blue">{t("rent.step")} 1 {t("rent.of")} 4</Typography.Text>
            </div>
            <Row gutter={[32, 24]}>
                <Col span={12}>
                    <Typography.Text className="font-medium">{t("rent.name")}</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.display_name}></Input>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">{t("rent.phoneNumber")}</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.phone_number}></Input>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">{t("rent.email")}</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.email}></Input>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">{t("rent.address")}</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={"12 District, Ho Chi Minh City"}></Input>
                </Col>
            </Row>
        </div>
    );
};

export default BillingInfo;