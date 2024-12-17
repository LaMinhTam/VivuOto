import React from 'react';
import { TextInput, Button, Text } from 'react-native-paper';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';
import { validateEmail, validatePassword } from '../utils/validate';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { register } from '../store/auth/handlers';
import { Toast } from '@ant-design/react-native';

const RegisterScreen = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const { t } = useTranslation();
    // const { verification_code, error } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const [errorType, setErrorType] = React.useState({
        require: {
            name: false,
            email: false,
            password: false,
        },
        validate: {
            email: false,
            password: false,
        },
    });

    const handleRegister = async () => {
        // Reset error state
        setErrorType({
            require: {
                name: false,
                email: false,
                password: false,
            },
            validate: {
                email: false,
                password: false,
            },
        });

        // Pre-validation
        let hasError = false;
        if (!name) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, name: true } }));
            hasError = true;
        }
        if (!email) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, email: true } }));
            hasError = true;
        }
        if (!password) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, password: true } }));
            hasError = true;
        }
        if (email && !validateEmail(email)) {
            setErrorType((prev) => ({ ...prev, validate: { ...prev.validate, email: true } }));
            hasError = true;
        }
        if (password && !validatePassword(password)) {
            setErrorType((prev) => ({ ...prev, validate: { ...prev.validate, password: true } }));
            hasError = true;
        }

        if (!hasError) {
            // dispatch({ type: SIGN_UP, payload: { name, email, password } });
            const key = Toast.loading({
                content: t('common.processing'),
                duration: 0,
                mask: true
            });
            const res = await register(name, email, password);
            if (res.success) {
                Toast.remove(key);
                Toast.success(t('common.success'), 1);
                navigation.navigate('VERIFY_CODE_SCREEN', { verification_code: res?.data?.verification_code, email: email });
            } else {
                Toast.remove(key);
                Toast.fail(t(`msg.${res?.message ?? ''}`));
            }
        }
    };

    return (
        <LayoutAuthentication
            title={t('auth.register.title')}
            desc={t('auth.register.desc')}
            type='REGISTER'
        >
            <TextInput
                label={t('auth.register.name')}
                mode="outlined"
                className="w-full mb-2"
                value={name}
                onChangeText={(text) => setName(text)}
                outlineStyle={{ borderRadius: 10 }}
            />
            <View className='flex-row items-center justify-start w-full mb-2'>
                {errorType.require.name && (
                    <Text className="mb-2 text-error">{t('validate.required')}</Text>
                )}
            </View>

            <TextInput
                label={t('auth.register.email')}
                mode="outlined"
                className="w-full mb-2"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
                outlineStyle={{ borderRadius: 10 }}
            />
            <View className='flex-row items-center justify-start w-full mb-2'>
                {errorType.require.email && (
                    <Text className="mb-2 text-error">{t('validate.required')}</Text>
                )}
                {errorType.validate.email && (
                    <Text className="mb-2 text-error">{t('validate.email')}</Text>
                )}
            </View>

            <TextInput
                label={t('auth.register.password')}
                mode="outlined"
                className="w-full mb-2"
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-outline" : "eye-off-outline"} onPress={() => setShowPassword(!showPassword)} />}
                value={password}
                onChangeText={(text) => setPassword(text)}
                outlineStyle={{ borderRadius: 10 }}
            />
            <View className='flex-row items-center justify-start w-full mb-4'>
                {errorType.require.password && (
                    <Text className="mb-2 text-error">{t('validate.required')}</Text>
                )}
                {errorType.validate.password && (
                    <Text className="mb-2 text-error">{t('validate.password')}</Text>
                )}
            </View>

            <Button
                mode="contained"
                className="w-full mb-4"
                onPress={handleRegister}
            >
                {t('auth.register')}
            </Button>
        </LayoutAuthentication>
    );
};

export default RegisterScreen;
