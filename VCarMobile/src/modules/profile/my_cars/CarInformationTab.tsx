import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Flex, Form, Input, Modal } from '@ant-design/react-native'
import { ICreateCarData } from '../../../store/car/types'
import { useTranslation } from 'react-i18next'
import { Chip } from 'react-native-elements'
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FormInstance } from '@ant-design/react-native/lib/form'

const CarInformationTab = ({ form }: {
    form: FormInstance<ICreateCarData>
}) => {
    const { t, i18n } = useTranslation()
    const [color, setColor] = useState(form?.getFieldValue('color') || '#0068ff')
    const [visible, setVisible] = useState(false)
    const [selectedTransmission, setSelectedTransmission] = useState<'MANUAL' | 'AUTO'>('MANUAL');
    const [selectedFuel, setSelectedFuel] = useState<'GASOLINE' | 'DIESEL_OIL' | 'ELECTRICITY'>('GASOLINE');
    const [manufacturingYear, setManufacturingYear] = useState<Date>(new Date());
    const handleStatusChange = (status: 'MANUAL' | 'AUTO') => {
        form.setFieldsValue({ transmission: status })
        setSelectedTransmission(status);
    };

    const handleFuelValueChange = (fuel: 'GASOLINE' | 'DIESEL_OIL' | 'ELECTRICITY') => {
        form.setFieldsValue({ fuel })
        setSelectedFuel(fuel);
    };

    const onSelectColor = ({ hex }: { hex: string }) => {
        setColor(hex)
    };
    const handleSaveColor = () => {
        form.setFieldsValue({ color })
        setVisible(false)
    }

    useEffect(() => {
        const { color, transmission, fuel, manufacturing_year } = form.getFieldsValue()
        if (color) setColor(color)
        if (['AUTO', 'MANUAL']?.includes(transmission)) setSelectedTransmission(transmission as 'MANUAL' | 'AUTO')
        if (fuel) setSelectedFuel(fuel as 'GASOLINE' | 'DIESEL_OIL' | 'ELECTRICITY')
        if (manufacturing_year) setManufacturingYear(new Date(manufacturing_year, 0, 1))
    }, [form])

    return (
        <>
            <ScrollView>
                <Form.Item<ICreateCarData>
                    name="name"
                    label={t("car.name")}
                    rules={[{ required: true, message: t("car.name.required") }]}
                >
                    <Input placeholder={t("car.name")} style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="seat"
                    label={t("car.seat")}
                    rules={[{ required: true, message: t("car.seat.required") }]}
                >
                    <Input keyboardType='numeric' placeholder={t("car.seat")} style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="brand"
                    label={t("car.brand")}
                    rules={[{ required: true, message: t("car.brand.required") }]}
                >
                    <Input placeholder={t("car.brand")} style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="transmission"
                    label={t("car.transmission")}
                    rules={[{ required: true, message: t("car.transmission.required") }]}
                >
                    <Flex style={{ marginLeft: 10 }}>
                        <Chip
                            title={t("car.manual")}
                            type={selectedTransmission === 'MANUAL' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('MANUAL')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                        <Chip
                            title={t("car.automatic")}
                            type={selectedTransmission === 'AUTO' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('AUTO')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                    </Flex>
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="province"
                    label={t("car.province")}
                    rules={[{ required: true, message: t("car.province.required") }]}
                >
                    <Input placeholder={t("car.province")} style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="color"
                    label={t("car.color")}
                    rules={[{ required: true, message: t("car.color.required") }]}
                >
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <Icon name='format-color-fill' size={16} color={color}></Icon>
                    </TouchableOpacity>
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="manufacturing_year"
                    label={t("car.manufacturing_year")}
                    rules={[{ required: true, message: t("car.manufacturing_year.required") }]}
                >
                    <DatePicker
                        value={manufacturingYear}
                        precision="year"
                        onChange={(date) => {
                            setManufacturingYear(date)
                            form.setFieldsValue({ manufacturing_year: date.getFullYear() })
                        }}
                        format="YYYY"
                    >
                        <Text className="p-2 ml-5 border border-gray-300 rounded">{manufacturingYear.getFullYear()}</Text>
                    </DatePicker>
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="fuel"
                    label={t("car.fuel")}
                    rules={[{ required: true, message: t("car.fuel.required") }]}
                >
                    <Flex style={{ marginLeft: 10 }}>
                        <Chip
                            title={t("car.gasoline")}
                            type={selectedFuel === 'GASOLINE' ? 'solid' : 'outline'}
                            onPress={() => handleFuelValueChange('GASOLINE')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                        <Chip
                            title={t("car.diesel_oil")}
                            type={selectedFuel === 'DIESEL_OIL' ? 'solid' : 'outline'}
                            onPress={() => handleFuelValueChange('DIESEL_OIL')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                        <Chip
                            title={t("car.electricity")}
                            type={selectedFuel === 'ELECTRICITY' ? 'solid' : 'outline'}
                            onPress={() => handleFuelValueChange('ELECTRICITY')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                    </Flex>
                </Form.Item>
                <Form.Item<ICreateCarData>
                    name="fuel_consumption"
                    label={t("car.fuel_consumption")}
                    rules={[{ required: true, message: t("car.fuel_consumption.required") }]}
                >
                    <Input keyboardType='numeric' suffix={"lít / 100km"} style={{ marginLeft: 10, width: '80%', alignSelf: 'center' }} />
                </Form.Item>
                <Form.Item
                    name="location"
                    label={t("car.location")}
                    rules={[{ required: true, message: t("car.location.required") }]}
                >
                    <Input placeholder={t('car.location')} style={{ marginLeft: 10 }} />
                </Form.Item>
            </ScrollView>
            <Modal
                popup
                visible={visible}
                animationType="slide-up"
                onClose={() => setVisible(false)}
            >
                <ColorPicker style={{ width: '100%' }} value='red' onComplete={onSelectColor}>
                    <Preview />
                    <Panel1 />
                    <HueSlider />
                    <OpacitySlider />
                    <Swatches />
                </ColorPicker>
                <Button type='primary' onPress={handleSaveColor}>{t('common.save')}</Button>
            </Modal>
        </>
    )
}

export default CarInformationTab