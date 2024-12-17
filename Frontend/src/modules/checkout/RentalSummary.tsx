import { Col, Divider, Image, Rate, Row, Typography } from "antd";
import { formatPrice } from "../../utils";
import { ICar } from "../../store/car/types";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RentalSummary = ({ car, totalDays }: {
    car: ICar,
    totalDays: number
}) => {
    const { t } = useTranslation()
    const navigation = useNavigate();
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <Typography.Title level={5}>{t("rent.rentSummary")}</Typography.Title>
            <Typography.Paragraph className="text-sm text-custom-blue">{t("rent.rentSummary.desc")}</Typography.Paragraph>
            <Row justify={"center"} gutter={[16, 0]}>
                <Col span={8}>
                    <Image preview={false} src={car?.image_url[0] ?? DEFAULT_AVATAR} alt={car?.name} className="object-contain w-full h-full rounded-lg cursor-pointer" onClick={() => navigation(`/car/${car.id}`)}></Image>
                </Col>
                <Col span={16}>
                    <Typography.Title level={4}>{car?.name}</Typography.Title>
                    <Row justify={"center"} align={"middle"}>
                        <Col span={14}>
                            <Rate disabled defaultValue={car?.average_rating} className="text-lg"></Rate>
                        </Col>
                        <Col span={10}>
                            <Typography.Text className="text-sm font-normal">440+ {t("common.reviewer")}</Typography.Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider></Divider>
            <div className="flex items-center justify-between">
                <Typography.Text className="text-custom-blue">{t("rent.unitPrice")}</Typography.Text>
                <Typography.Text>{formatPrice(car?.daily_rate)} VNĐ</Typography.Text>
            </div>
            <Divider></Divider>
            {/* <div className="flex items-center justify-between mt-6">
                <Typography.Text className="text-custom-blue">Thuế</Typography.Text>
                <Typography.Text>0 VNĐ</Typography.Text>
            </div> */}
            {/* <div className="w-full h-[56px] bg-grayf6 px-8 py-4 flex items-center justify-between rounded-lg my-8">
                <Typography.Text className="text-sm text-custom-blue">Áp dụng mã khuyến mãi</Typography.Text>
                <Typography.Text className="text-sm font-medium cursor-pointer">Áp dụng ngay</Typography.Text>
            </div> */}
            <Row>
                <Col span={16}>
                    <Typography.Title level={5}>{t("rent.totalPrice")}</Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">{t("rent.totalPrice.desc")}</Typography.Text>
                </Col>
                <Col span={8}>
                    <Typography.Title className="text-right" level={4}>{formatPrice(car?.daily_rate * totalDays)} VNĐ</Typography.Title>
                </Col>
            </Row>
        </div>
    );
};

export default RentalSummary;