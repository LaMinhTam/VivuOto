import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Picker, Form, Button } from '@ant-design/react-native';
import { Chip } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { ICreateCarData } from '../../../store/car/types';
import { FormInstance } from '@ant-design/react-native/lib/form';

const carFeatures = [
    { label: 'car.feature.map', value: 'MAP' },
    { label: 'car.feature.bluetooth', value: 'BLUETOOTH' },
    { label: 'car.feature.camera360', value: 'CAMERA360' },
    { label: 'car.feature.reverse_camera', value: 'REVERSE_CAMERA' },
    { label: 'car.feature.dash_camera', value: 'DASH_CAMERA' },
    { label: 'car.feature.parking_camera', value: 'PARKING_CAMERA' },
    { label: 'car.feature.tire_sensor', value: 'TIRE_SENSOR' },
    { label: 'car.feature.collision_sensor', value: 'COLLISION_SENSOR' },
    { label: 'car.feature.speed_warning', value: 'SPEED_WARNING' },
    { label: 'car.feature.sunroof', value: 'SUNROOF' },
    { label: 'car.feature.gps', value: 'GPS' },
    { label: 'car.feature.child_seat', value: 'CHILD_SEAT' },
    { label: 'car.feature.usb_port', value: 'USB_PORT' },
    { label: 'car.feature.spare_tire', value: 'SPARE_TIRE' },
    { label: 'car.feature.dvd_player', value: 'DVD_PLAYER' },
    { label: 'car.feature.truck_cover', value: 'TRUCK_COVER' },
    { label: 'car.feature.etc', value: 'ETC' },
    { label: 'car.feature.airbag', value: 'AIRBAG' },
];

const CarFeatureTab = ({ form, features }: { form: FormInstance<ICreateCarData>, features?: string[] }) => {
    const { t } = useTranslation();
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (features) {
            setSelectedFeatures(features);
        }
    }, [features]);

    useMemo(() => {
        form.setFieldsValue({ features: selectedFeatures });
    }, [selectedFeatures]);

    const handleAddFeature = (value: string | undefined) => {
        if (value && !selectedFeatures.includes(value)) {
            setSelectedFeatures([...selectedFeatures, value]);
        }
    };

    const handleRemoveFeature = (feature: string) => {
        setSelectedFeatures(selectedFeatures.filter((item) => item !== feature));
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Form.Item<ICreateCarData>
                name="features"
                label={t("car.features")}
                rules={[{ required: true, message: t("car.features.required") }]}
            >
                <Button style={{ width: '100%', height: 40, marginLeft: 10 }} onPress={() => setVisible(true)}>
                    {t("profile.my_cars.choose_feature")}
                </Button>
            </Form.Item>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
                {selectedFeatures.map((feature) => (
                    <Chip
                        key={feature}
                        title={t(`car.feature.${feature.toLowerCase()}`)}
                        onPress={() => handleRemoveFeature(feature)}
                        buttonStyle={{ margin: 4 }}
                        type="outline"
                        iconPosition='right'
                        icon={{
                            name: 'close',
                            type: 'material',
                            size: 18,
                            color: 'gray',
                            onPress: () => handleRemoveFeature(feature),
                        }}
                    />
                ))}
            </View>

            <Picker
                data={carFeatures.map((feature) => ({
                    label: t(feature.label),
                    value: feature.value,
                }))}
                visible={visible}
                cols={1}
                value={undefined}
                onChange={(value) => handleAddFeature(value?.[0]?.toString())}
                itemStyle={{ paddingVertical: 8 }}
                onClose={() => setVisible(false)}
            />
        </ScrollView>
    );
};

export default CarFeatureTab;
