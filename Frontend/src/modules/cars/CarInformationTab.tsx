import { Col, DatePicker, Form, Input, InputNumber, Row, Select, } from "antd";
import CustomColorPicker from "../../components/common/CustomColorPicker";
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from "../../constants";
import { useTranslation } from "react-i18next";

const CarInformationTab = () => {
    const { t } = useTranslation();
    return (
        <Row gutter={[100, 12]}>
            <Col span={12}>
                <Form.Item
                    name="name"
                    label={t("car.name")}
                    rules={[{ required: true, message: t("car.name.required") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="seat"
                    label={t("car.seat")}
                    rules={[{ required: true, message: t("car.seat.required") }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="brand"
                    label={t("car.brand")}
                    rules={[{ required: true, message: t("car.brand.required") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="transmission"
                    label={t("car.transmission")}
                    rules={[{ required: true, message: t("car.transmission.required") }]}
                >
                    <Select
                        options={TRANSMISSION_OPTIONS}
                    ></Select>
                </Form.Item>
                <Form.Item
                    name="province"
                    label={t("car.province")}
                    rules={[{ required: true, message: t("car.province.required") }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="color"
                    label={t("car.color")}
                    rules={[{ required: true, message: t("car.color.required") }]}
                >
                    <CustomColorPicker></CustomColorPicker>
                </Form.Item>
                <Form.Item
                    name="manufacturing_year"
                    label={t("car.manufacturing_year")}
                    rules={[{ required: true, message: t("car.manufacturing_year.required") }]}
                >
                    <DatePicker
                        picker="year"
                        allowClear
                        style={{ width: '100%' }}
                        value={2021}
                    ></DatePicker>
                </Form.Item>
                <Form.Item
                    name="fuel"
                    label={t("car.fuel")}
                    rules={[{ required: true, message: t("car.fuel.required") }]}
                >
                    <Select
                        options={FUEL_OPTIONS}
                    ></Select>
                </Form.Item>
                <Form.Item
                    name="fuel_consumption"
                    label={t("car.fuel_consumption")}
                    rules={[{ required: true, message: t("car.fuel_consumption.required") }]}
                >
                    <InputNumber className="w-[250px]" addonAfter={"lít / 100km"} />
                </Form.Item>
                <Form.Item
                    name="location"
                    label={t("car.location")}
                    rules={[{ required: true, message: t("car.location.required") }]}
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default CarInformationTab;