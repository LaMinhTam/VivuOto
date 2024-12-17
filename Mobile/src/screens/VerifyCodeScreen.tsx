import React, { useState, useRef } from 'react';
import { View, TextInput as RNTextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Loading from '../components/common/Loading';
import { verifyEmail } from '../store/auth/handlers';
import { Toast } from '@ant-design/react-native';
import { setIsReCheckToken } from '../store/auth/reducers';

const VerifyCodeScreen = () => {
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const route = useRoute();
    const { verification_code, email } = route.params as { verification_code: string, email: string };
    const [code, setCode] = useState<string[]>(
        Array.from({ length: verification_code.length || 5 }, () => ''),
    );
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { t } = useTranslation();
    const inputRefs = useRef<(RNTextInput | null)[]>([]);
    const dispatch = useDispatch();

    const handleVerifyCode = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const enteredCode = code.join('');
        const res = await verifyEmail(email, enteredCode);
        if (res.success) {
            Toast.remove(key);
            Toast.success(t('common.success'), 1);
            dispatch(setIsReCheckToken(!isRecheckToken));
        } else {
            Toast.remove(key);
            Toast.fail(t(`msg.${res?.message ?? ''}`));
        }
    };

    const handleChangeText = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text) {
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <LayoutAuthentication
            title={t('verify_code.title')}
            desc={t('verify_code.desc')}
            type="VERIFY"
        >
            <View className="flex-row justify-between w-4/5 mb-8">
                {code.map((digit, index) => (
                    <RNTextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        value={digit}
                        onChangeText={(text) => handleChangeText(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-2xl text-center border border-[#ccc] rounded-lg text-[#333]"
                    />
                ))}
            </View>
            <Button
                mode="contained"
                onPress={handleVerifyCode}
                className="w-4/5 py-2 bg-blue-500 rounded-lg"
                disabled={loading}
            >
                {!loading ? t('verify_code.submit') : <Loading />}
            </Button>
        </LayoutAuthentication>
    );
};

export default VerifyCodeScreen;
