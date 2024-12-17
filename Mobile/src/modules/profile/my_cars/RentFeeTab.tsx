import { ScrollView, View } from 'react-native'
import React, { useEffect } from 'react'
import { Form, Input } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next';
import { ICreateCarData } from '../../../store/car/types';
import { FormInstance } from '@ant-design/react-native/lib/form';

const RentFeeTab = ({ form }: {
    form: FormInstance<ICreateCarData>
}) => {
    const { t } = useTranslation();
    return (
        <ScrollView>
            <Form.Item<ICreateCarData>
                name="daily_rate"
                label={t("car.daily_rate")}
                rules={[{ required: true, message: t("car.daily_rate.required") }]}
            >
                <Input keyboardType='numeric' placeholder={t("car.daily_rate")} style={{ marginLeft: 10 }} suffix={`VNĐ`} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="mileage_limit_per_day"
                label={t("car.mileage_limit_per_day")}
                rules={[{ required: true, message: t("car.mileage_limit_per_day.required") }]}
            >
                <Input keyboardType='numeric' placeholder={t("car.mileage_limit_per_day")} style={{ marginLeft: 10 }} suffix={`Km`} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="extra_mileage_charge"
                label={t("car.extra_mileage_charge")}
                rules={[{ required: true, message: t("car.extra_mileage_charge.required") }]}
            >
                <Input keyboardType='numeric' placeholder={t("car.extra_mileage_charge")} style={{ marginLeft: 10 }} suffix={`VNĐ`} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="extra_hourly_charge"
                label={t("car.extra_hourly_charge")}
                rules={[{ required: true, message: t("car.extra_hourly_charge.required") }]}
            >
                <Input keyboardType='numeric' placeholder={t("car.extra_hourly_charge")} style={{ marginLeft: 10 }} suffix={`VNĐ`} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="washing_price"
                label={t("car.washing_price")}
                rules={[{ required: true, message: t("car.washing_price.required") }]}
            >
                <Input keyboardType='numeric' placeholder={t("car.washing_price")} style={{ marginLeft: 10 }} suffix={`VNĐ`} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="deodorise_price"
                label={t("car.deodorise_price")}
                rules={[{ required: true, message: t("car.deodorise_price.required") }]}
            >
                <Input keyboardType='numeric' placeholder={t("car.deodorise_price")} style={{ marginLeft: 10 }} suffix={`VNĐ`} />
            </Form.Item>
        </ScrollView>
    )
}

export default RentFeeTab