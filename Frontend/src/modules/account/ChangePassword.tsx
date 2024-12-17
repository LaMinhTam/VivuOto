import { Form, Input, Button, message, Typography, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { changePassword } from "../../store/profile/handlers";
import { useState } from "react";

const ChangePassword = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { old_password: string; new_password: string; confirm_password: string }) => {
        setLoading(true)
        if (values.new_password !== values.confirm_password) {
            message.error(t("account.change_password.passwords_mismatch"));
            setLoading(false)
            return;
        }

        const response = await changePassword(values.old_password, values.new_password);
        if (response.success) {
            message.success(t("account.change_password.success"));
            form.resetFields();
            setLoading(false)
        } else {
            message.error(t(response.message) || t("account.change_password.error"));
            setLoading(false)
        }
    };

    return (
        <Spin spinning={loading}>
            <div className="px-8 py-6 rounded-lg shadow-md bg-lite">
                <div className="max-w-md mx-auto">
                    <Typography.Title level={4}>{t("account.change_password.title")}</Typography.Title>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="old_password"
                            label={t("account.change_password.old_password")}
                            rules={[{ required: true, message: t("account.change_password.old_password_required") }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="new_password"
                            label={t("account.change_password.new_password")}
                            rules={[
                                { required: true, message: t("account.change_password.new_password_required") },
                                { min: 8, message: t("account.change_password.password_min_length") }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            label={t("account.change_password.confirm_password")}
                            rules={[
                                { required: true, message: t("account.change_password.confirm_password_required") },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t("account.change_password.passwords_mismatch")));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {t("account.change_password.submit")}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Spin>
    );
};

export default ChangePassword;