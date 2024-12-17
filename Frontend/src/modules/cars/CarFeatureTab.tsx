import React, { useEffect, useState } from "react";
import { Form, Row, Col, Select, Tag } from "antd";
import { useTranslation } from "react-i18next";

const carFeatures = [
    { label: "car.feature.map", value: "MAP" },
    { label: "car.feature.bluetooth", value: "BLUETOOTH" },
    { label: "car.feature.camera360", value: "CAMERA360" },
    { label: "car.feature.reverse_camera", value: "REVERSE_CAMERA" },
    { label: "car.feature.dash_camera", value: "DASH_CAMERA" },
    { label: "car.feature.parking_camera", value: "PARKING_CAMERA" },
    { label: "car.feature.tire_sensor", value: "TIRE_SENSOR" },
    { label: "car.feature.collision_sensor", value: "COLLISION_SENSOR" },
    { label: "car.feature.speed_warning", value: "SPEED_WARNING" },
    { label: "car.feature.sunroof", value: "SUNROOF" },
    { label: "car.feature.gps", value: "GPS" },
    { label: "car.feature.child_seat", value: "CHILD_SEAT" },
    { label: "car.feature.usb_port", value: "USB_PORT" },
    { label: "car.feature.spare_tire", value: "SPARE_TIRE" },
    { label: "car.feature.dvd_player", value: "DVD_PLAYER" },
    { label: "car.feature.truck_cover", value: "TRUCK_COVER" },
    { label: "car.feature.etc", value: "ETC" },
    { label: "car.feature.airbag", value: "AIRBAG" }
];

const CarFeatureTab = ({ features }: {
    features?: string[];
}) => {
    const { t } = useTranslation();
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const handleAddFeature = (value: string[]) => {
        setSelectedFeatures(value);
    };

    useEffect(() => {
        if (features) {
            setSelectedFeatures(features);
        }
    }, [features]);

    const handleRemoveFeature = (feature: string, e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const updatedFeatures = selectedFeatures.filter((item) => item !== feature);
        setSelectedFeatures(updatedFeatures);
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form.Item
                    name="features"
                    label={t("car.features")}
                    rules={[{ required: true, message: t("car.features.required") }]}
                >
                    <Select
                        mode="multiple"
                        placeholder={t("common.search")}
                        style={{ width: '100%' }}
                        value={selectedFeatures}
                        onChange={handleAddFeature}
                        allowClear
                        options={carFeatures.map((feature) => ({
                            label: t(feature.label),
                            value: feature.value,
                        }))}
                        filterOption={(input, option) => {
                            if (option) {
                                return option?.label?.toLowerCase()?.includes(input?.toLowerCase());
                            }
                            return false;
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={24}>
                <div>
                    {selectedFeatures.map((feature) => (
                        <Tag
                            key={feature}
                            closable
                            onClose={(e) => handleRemoveFeature(feature, e)}
                            color="blue"
                        >
                            {t(`car.feature.${feature.toLowerCase()}`)}
                        </Tag>
                    ))}
                </div>
            </Col>
        </Row>
    );
};

export default CarFeatureTab;
