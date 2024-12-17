import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Flex, InputItem, Toast } from '@ant-design/react-native';
import StepIndicator from 'react-native-step-indicator';
import { useTranslation } from 'react-i18next';
import { handleForgotPassword, handleResetPassword } from '../store/auth/handlers';
import { validateEmail } from '../utils/validate';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);

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
        if (!validateEmail(email)) {
            Toast.fail(t('email.error.invalid'));
            return;
        }
        const response = await handleForgotPassword(email);
        if (response?.success) {
            Toast.success(t(`msg.${response.message}`));
            setCurrentStep(1);
            setIsResendDisabled(true);
        } else {
            Toast.fail(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
        }
    };

    const handleResend = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const response = await handleForgotPassword(email);
        if (response?.success) {
            Toast.remove(key);
            Toast.success(t(`msg.${response.message}`));
            setIsResendDisabled(true);
        } else {
            Toast.remove(key);
            Toast.fail(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
            setIsResendDisabled(false);
        }
    };

    const handleResetPasswordSubmit = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        if (newPassword.length < 8) {
            Toast.fail(t('forgot_password.new_password.invalid'));
            Toast.remove(key);
            return;
        }
        const response = await handleResetPassword(email, otp, newPassword);
        if (response?.success) {
            Toast.success(t(`msg.${response.message}`));
            Toast.remove(key);
            navigation.navigate('LOGIN_SCREEN');
        } else {
            Toast.remove(key);
            Toast.fail(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View>
                        <InputItem
                            placeholder={t("forgot_password.input")}
                            value={email}
                            onChange={setEmail}
                        />
                        <Button type="primary" onPress={handleSubmitEmail}>
                            {t("common.send")}
                        </Button>
                    </View>
                );
            case 1:
                return (
                    <View>
                        <InputItem
                            placeholder={t("forgot_password.otp")}
                            value={otp}
                            onChange={setOtp}
                        />
                        <InputItem
                            placeholder={t("forgot_password.new_password")}
                            type="password"
                            value={newPassword}
                            onChange={setNewPassword}
                        />
                        <Flex align='center' justify='between' style={{ marginTop: 10 }}>
                            <Button type='ghost' onPress={handleResend} disabled={isResendDisabled}>
                                {isResendDisabled
                                    ? `${t("common.resend")} (${countdown}s)`
                                    : t("common.resend")
                                }
                            </Button>
                            <Button type="primary" onPress={handleResetPasswordSubmit}>
                                {t("common.reset_password")}
                            </Button>
                        </Flex>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <StepIndicator
                currentPosition={currentStep}
                labels={[t("forgot_password.step1"), t("forgot_password.step2")]}
                stepCount={2}
            />
            <Text className="mt-4 mb-4 text-sm text-gray-600">
                {currentStep === 0 ? t("forgot_password.desc") : t("forgot_password.enter_otp_desc")}
            </Text>
            {renderStepContent()}
        </View>
    );
};

export default ForgotPasswordScreen;