import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { validateEmail, validatePassword } from '../utils/validate';
import { login } from '../store/auth/handlers';
import { Toast } from '@ant-design/react-native';
import { setIsReCheckToken } from '../store/auth/reducers';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [showPassword, setShowPassword] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const [errorType, setErrorType] = React.useState({
        require: {
            email: false,
            password: false
        },
        validate: {
            email: false,
            password: false
        }
    });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        // Reset error state
        setErrorType({
            require: {
                email: false,
                password: false
            },
            validate: {
                email: false,
                password: false
            }
        });

        // Pre-validation
        let hasError = false;
        if (!username) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, email: true } }));
            hasError = true;
        }
        if (!password) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, password: true } }));
            hasError = true;
        }
        if (username && !validateEmail(username)) {
            setErrorType((prev) => ({ ...prev, validate: { ...prev.validate, email: true } }));
            hasError = true;
        }
        if (password && !validatePassword(password)) {
            setErrorType((prev) => ({ ...prev, validate: { ...prev.validate, password: true } }));
            hasError = true;
        }

        if (!hasError) {
            // Call API if no pre-validation errors
            // dispatch({ type: LOGIN, payload: { username, password } });
            const key = Toast.loading({
                content: t('common.processing'),
                duration: 0,
                mask: true
            });
            const response = await login(username, password);
            if (response.success) {
                Toast.remove(key);
                Toast.success(t('common.success'));
                dispatch(setIsReCheckToken(!isRecheckToken));
            } else {
                Toast.remove(key);
                Toast.fail(t(`msg.${response?.message ?? ''}`));
            }
        }
    };

    useEffect(() => {
        Toast.removeAll()
    }, [])

    return (
        <LayoutAuthentication
            title={t('auth.login.title')}
            desc={t('auth.login.desc')}
            type='LOGIN'
        >
            <TextInput
                label={t('auth.login.email')}
                mode="outlined"
                className="w-full mb-2"
                keyboardType="email-address"
                outlineStyle={{ borderRadius: 10 }}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />

            <View className='flex-row items-center justify-start w-full mb-2'>
                {errorType.require.email ? <Text className="text-error">{t('validate.required')}</Text> : null}
                {errorType.validate.email ? <Text className="text-error">{t('validate.email')}</Text> : null}
            </View>

            <TextInput
                label={t('auth.login.password')}
                mode="outlined"
                className="w-full mb-4"
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-outline" : "eye-off-outline"} onPress={() => setShowPassword(!showPassword)} />}
                outlineStyle={{ borderRadius: 10 }}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <View className='flex-row items-center justify-start w-full mb-2'>
                {errorType.require.password ? <Text className="text-error">{t('validate.required')}</Text> : null}
                {errorType.validate.password ? <Text className="text-error">{t('validate.password')}</Text> : null}
            </View>

            <View className="flex-row items-center justify-end w-full mr-2">
                <Pressable onPress={() => navigation.navigate('FORGOT_PASSWORD_SCREEN')}>
                    <Text className="mb-6 text-sm text-text2">{t('auth.login.forgot_password')}</Text>
                </Pressable>
            </View>
            <Button mode="contained" className="w-full mb-4" disabled={loading} onPress={handleLogin}>
                {t('auth.login')}
            </Button>
            {/* <Pressable className='items-center flex-1' onPress={() => navigation.navigate(`REGISTER_SCREEN`)}>
                <Text className="text-sm text-text2">{t('auth.login.register')} <Text className="font-bold text-text8">{t('auth.register')}</Text></Text>
            </Pressable> */}
        </LayoutAuthentication>
    );
};

export default LoginScreen;