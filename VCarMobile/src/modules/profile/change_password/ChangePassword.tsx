import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, InputItem, Toast, Form } from '@ant-design/react-native';
import { changePassword } from '../../../store/profile/handlers';

interface ChangePasswordProps {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
const ChangePassword = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleSubmit = async (values: ChangePasswordProps) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const response = await changePassword(values.oldPassword, values.newPassword);
        if (response.success) {
            Toast.remove(key);
            Toast.success(t('account.change_password.success'));
            form.resetFields();
        } else {
            Toast.remove(key);
            Toast.fail(t(`msg.${response.message}`) || t('account.change_password.error'));
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="px-4 py-6 m-4 bg-white rounded-lg">
                <Form
                    name='changePasswordForm'
                    form={form}
                    onFinish={handleSubmit}
                    initialValues={{
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    }}
                >
                    <Form.Item<ChangePasswordProps>
                        name="oldPassword"
                        rules={[{ required: true, message: t('account.change_password.old_password_required') }]}
                    >
                        <InputItem
                            type="password"
                            placeholder={t('account.change_password.old_password')}
                        />
                    </Form.Item>
                    <Form.Item<ChangePasswordProps>
                        name="newPassword"
                        rules={[
                            { required: true, message: t('account.change_password.new_password_required') },
                            { min: 8, message: t('account.change_password.password_min_length') }
                        ]}
                    >
                        <InputItem
                            type="password"
                            placeholder={t('account.change_password.new_password')}
                        />
                    </Form.Item>
                    <Form.Item<ChangePasswordProps>
                        name="confirmPassword"
                        rules={[
                            { required: true, message: t('account.change_password.confirm_password_required') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('account.change_password.passwords_mismatch')));
                                },
                            }),
                        ]}
                    >
                        <InputItem
                            type="password"
                            placeholder={t('account.change_password.confirm_password')}
                        />
                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    className="mt-4"
                    onPress={() => form.submit()}
                >
                    {t('account.change_password.submit')}
                </Button>
            </View>
        </ScrollView>
    );
};

export default ChangePassword;