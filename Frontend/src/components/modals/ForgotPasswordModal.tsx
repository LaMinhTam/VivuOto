import { Button, Col, Flex, Input, Row, Typography, Steps, Form } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { handleForgotPassword, handleResetPassword } from "../../store/auth/handlers";
import { toast } from "react-toastify";

const { Step } = Steps;

const ForgotPasswordModal = ({ setOpen }: {
    setOpen: (isOpen: boolean) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isResendDisabled && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
            setCountdown(60);
        }
        return () => clearTimeout(timer);
    }, [isResendDisabled, countdown]);

    const handleSubmitEmail = async () => {
        try {
            await form.validateFields(['email']);
            setLoading(true);
            const email = form.getFieldValue('email');
            const response = await handleForgotPassword(email);
            if (response?.success) {
                toast.success(t(`msg.${response.message}`));
                setCurrentStep(1);
                setIsResendDisabled(true);
            } else {
                toast.error(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        const email = form.getFieldValue('email');
        const response = await handleForgotPassword(email);
        if (response?.success) {
            toast.success(t(`msg.${response.message}`));
            setIsResendDisabled(true);
        } else {
            toast.error(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
            setIsResendDisabled(false);
        }
        setLoading(false);
    };

    const handleResetPasswordSubmit = async () => {
        try {
            await form.validateFields();
            setLoading(true);
            const { otp, newPassword } = form.getFieldsValue();
            const response = await handleResetPassword(email, otp, newPassword);
            if (response?.success) {
                toast.success(t(`msg.${response.message}`));
                form.resetFields();
                setCurrentStep(1);
                setOpen(false)
            } else {
                toast.error(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: t("require") },
                                { type: 'email', message: t("email.error.invalid") }
                            ]}
                        >
                            <Input
                                type="email"
                                placeholder={t("forgot_password.input")}
                                size="large"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>
                        <Button type="primary" size="large" block onClick={handleSubmitEmail} loading={loading}>
                            {t("common.send")}
                        </Button>
                    </Form>
                );
            case 1:
                return (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="otp"
                            rules={[{ required: true, message: t("require") }]}
                        >
                            <Input
                                placeholder={t("forgot_password.otp")}
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            rules={[
                                { required: true, message: t("require") },
                                { min: 8, message: t("forgot_password.new_password.invalid") }
                            ]}
                        >
                            <Input.Password
                                placeholder={t("forgot_password.new_password")}
                                size="large"
                            />
                        </Form.Item>
                        <Flex align="center" justify="flex-end" className="w-full mb-2">
                            <Button
                                type="link"
                                onClick={handleResend}
                                disabled={isResendDisabled}
                            >
                                {isResendDisabled
                                    ? `${t("common.resend")} (${countdown}s)`
                                    : t("common.resend")
                                }
                            </Button>
                        </Flex>
                        <Button type="primary" size="large" block onClick={handleResetPasswordSubmit} loading={loading}>
                            {t("common.reset_password")}
                        </Button>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <Row>
            <Col span={24}>
                <Steps current={currentStep} className="mb-4">
                    <Step title={t("forgot_password.step1")} />
                    <Step title={t("forgot_password.step2")} />
                </Steps>
                <Typography.Text type="secondary" className="mb-5">
                    {currentStep === 0 ? t("forgot_password.desc") : t("forgot_password.enter_otp_desc")}
                </Typography.Text>
                {renderStepContent()}
            </Col>
        </Row>
    );
};

export default ForgotPasswordModal;