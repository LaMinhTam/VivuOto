import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, TextInput } from 'react-native-paper';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LanguageDialog from '../components/dialog/LanguageDialog';
import { useTranslation } from 'react-i18next';
import { Flex } from '@ant-design/react-native';

const LayoutAuthentication = ({ title, desc, type, children }: {
    title: string,
    desc: string,
    type: string,
    children: React.ReactNode
}) => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [languageDialogVisible, setLanguageDialogVisible] = React.useState(false);
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                backgroundColor: '#F5FCFF',
            }}
            keyboardShouldPersistTaps="handled"
        >
            <View className="flex-row items-start justify-end flex-1 w-full pt-4 pr-4">
                <Pressable onPress={() => setLanguageDialogVisible(true)}>
                    <Icon name="globe-outline" size={28} color="black" />
                </Pressable>
            </View>
            <Flex align='center' justify='start' direction='column' style={{ paddingLeft: 24, paddingRight: 24, flex: 1 }}>
                <Text className="mb-2 text-3xl font-bold text-center text-text8">
                    {title}
                </Text>
                <Text className='mb-6 font-medium text-text2'>{desc}</Text>
                {children}
                {type !== 'VERIFY' && <Pressable onPress={() => navigation.navigate(`${type === "LOGIN" ? "REGISTER_SCREEN" : "LOGIN_SCREEN"}`)}>
                    <Text className="text-sm text-text2">
                        {type === "LOGIN" ? t('auth.login.register') : t('auth.register.login')}{' '}
                        <Text className="font-bold text-text8">{type === "LOGIN" ? t('auth.register') : t('auth.login')}</Text>
                    </Text>
                </Pressable>}
            </Flex>
            {languageDialogVisible && <LanguageDialog
                languageDialogVisible={languageDialogVisible}
                setLanguageDialogVisible={setLanguageDialogVisible}
            ></LanguageDialog>}
        </KeyboardAwareScrollView>
    )
}

export default LayoutAuthentication