import { Col, Form, InputNumber, Row } from "antd";
import { useTranslation } from "react-i18next";

const RentFeeTab = () => {
    const { t } = useTranslation();
    return (
        <Row>
            <Col span={12}>
                <Form.Item
                    name="daily_rate"
                    label={t("car.daily_rate")}
                    rules={[{ required: true, message: t("car.daily_rate.required") }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '80%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
                <Form.Item
                    name="mileage_limit_per_day"
                    label={t("car.mileage_limit_per_day")}
                    rules={[{ required: true, message: t("car.mileage_limit_per_day.required") }]}
                >
                    <InputNumber style={{ width: '80%' }} />
                </Form.Item>
                <Form.Item
                    name="extra_mileage_charge"
                    label={t("car.extra_mileage_charge")}
                    rules={[{ required: true, message: t("car.extra_mileage_charge.required") }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '80%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="extra_hourly_charge"
                    label={t("car.extra_hourly_charge")}
                    rules={[{ required: true, message: t("car.extra_hourly_charge.required") }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '80%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
                <Form.Item
                    name="washing_price"
                    label={t("car.washing_price")}
                    rules={[{ required: true, message: t("car.washing_price.required") }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '80%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
                <Form.Item
                    name="deodorise_price"
                    label={t("car.deodorise_price")}
                    rules={[{ required: true, message: t("car.deodorise_price.required") }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '80%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default RentFeeTab;