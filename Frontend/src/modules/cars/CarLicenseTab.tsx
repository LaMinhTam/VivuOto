import { Col, DatePicker, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";

const CarLicenseTab = () => {
    const { t } = useTranslation();
    return (
        <Row>
            <Col span={12}>
                <Form.Item
                    name="license_plate"
                    label={t('car.license_plate')}
                    rules={[{ required: true, message: t('car.license_plate.required') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="registration_number"
                    label={t('car.registration_number')}
                    rules={[{ required: true, message: t('car.registration_number.required') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="registration_date"
                    label={t('car.registration_date')}
                    rules={[{ required: true, message: t('car.registration_date.required') }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="registration_location"
                    label={t('car.registration_location')}
                    rules={[{ required: true, message: t('car.registration_location.required') }]}
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default CarLicenseTab;