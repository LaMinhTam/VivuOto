import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { FormInstance } from '@ant-design/react-native/lib/form'
import { ICreateCarData } from '../../../store/car/types'
import { DatePicker, Form, Input } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../../utils'
import moment from 'moment'

const CarLicenseTab = ({ form }: {
    form: FormInstance<ICreateCarData>
}) => {
    const { t } = useTranslation()
    const [registrationDate, setRegistrationDate] = useState<Date>(form?.getFieldValue('registration_date') ? new Date(form.getFieldValue('registration_date')) : new Date())
    return (
        <>
            <Form.Item<ICreateCarData>
                name="license_plate"
                label={t('car.license_plate')}
                rules={[{ required: true, message: t('car.license_plate.required') }]}
            >
                <Input style={{ marginLeft: 10 }} placeholder={t('car.license_plate')} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="registration_number"
                label={t('car.registration_number')}
                rules={[{ required: true, message: t('car.registration_number.required') }]}
            >
                <Input style={{ marginLeft: 10 }} placeholder={t('car.registration_number')} />
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="registration_date"
                label={t('car.registration_date')}
                rules={[{ required: true, message: t('car.registration_date.required') }]}
            >
                <DatePicker
                    value={registrationDate}
                    precision="day"
                    onChange={(date) => {
                        setRegistrationDate(date)
                        form.setFieldsValue({ registration_date: moment(date).format('YYYY-MM-DD') })
                    }}
                    format="YYYY-MM-DD"
                >
                    <Text className="p-2 ml-5 border border-gray-300 rounded">{moment(registrationDate || new Date()).format('YYYY-MM-DD')}</Text>
                </DatePicker>
            </Form.Item>
            <Form.Item<ICreateCarData>
                name="registration_location"
                label={t('car.registration_location')}
                rules={[{ required: true, message: t('car.registration_location.required') }]}
            >
                <Input style={{ marginLeft: 10 }} placeholder={t('car.registration_location')} />
            </Form.Item>
        </>
    )
}

export default CarLicenseTab