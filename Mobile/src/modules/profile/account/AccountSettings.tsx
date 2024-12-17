import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, SafeAreaView, Pressable, Text } from 'react-native';
import { Button, Flex, InputItem, List, Toast } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/configureStore';
import { Divider, Paragraph } from 'react-native-paper';
import { handleRecognizeCitizenIdentification, handleRecognizeLicensePlate, handleUploadFile } from '../../../utils';
import { buyToken, updateCitizenLicense, updateLicense, updateMetamaskAddress, updateProfile } from '../../../store/profile/handlers';
import LanguageDialog from '../../../components/dialog/LanguageDialog';
import i18n from '../../../locales';
import { GET_ME } from '../../../store/profile/action';
import { isEmpty } from 'lodash';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AccountSettings = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const route = useRoute();
    const { balance } = route.params as { balance: number };
    const { t } = useTranslation();
    const { me } = useSelector((state: RootState) => state.profile);
    const dispatch = useDispatch();
    const [refetchMe, setRefetchMe] = useState(false);
    const [avatar, setAvatar] = useState<Asset | null>(null);
    const [citizenIdentification, setCitizenIdentification] = useState<Asset | null>(null);
    const [driverLicense, setDriverLicense] = useState<Asset | null>(null);
    const [displayName, setDisplayName] = useState(me?.display_name || '');
    const [phoneNumber, setPhoneNumber] = useState(me?.phone_number || '');
    const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
    const { open, isConnected, address, provider } = useWalletConnectModal();
    const handleImagePicker = (type: string) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
            },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    if (type === 'avatar') {
                        setAvatar(response.assets[0]);
                    } else if (type === 'citizen_identification') {
                        setCitizenIdentification(response.assets[0]);
                    } else if (type === 'driver_license') {
                        setDriverLicense(response.assets[0]);
                    } else {
                        return;
                    }
                }
            }
        );
    };

    useEffect(() => {
        dispatch({ type: GET_ME })
    }, [refetchMe])


    const handleUploadAvatar = async (data: Asset, type: string) => {
        if (data) {
            try {
                const timestamp = new Date().getTime();
                const formData = new FormData();
                formData.append('file', {
                    uri: data.uri,
                    type: data.type,
                    name: data.fileName,
                });
                formData.append(
                    'upload_preset',
                    process.env.VITE_CLOUDINARY_PRESET_NAME || ''
                );
                let folderName = '';
                if (type === 'AVATAR') {
                    folderName = 'avatar';
                } else if (type === 'CITIZEN_IDENTIFICATION') {
                    folderName = 'citizen_identification';
                } else if (type === 'DRIVER_LICENSE') {
                    folderName = 'car_license';
                }
                formData.append('folder', `users/${me?.id}/${folderName}`);
                formData.append('public_id', `user_${folderName}_${timestamp}`);

                const imageUrl = await handleUploadFile(formData);
                return imageUrl;
            } catch (error) {
                console.error('Error uploading avatar:', error);
                Toast.fail(t('msg.UPLOAD_FAILURE'));
                return null;
            }
        }
        return null;
    };

    const onUpdateProfile = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        let imageUrl = me?.image_url;
        if (avatar) {
            imageUrl = await handleUploadAvatar(avatar, 'AVATAR');
        }

        const response = await updateProfile({
            display_name: displayName,
            phone_number: phoneNumber,
            image_url: imageUrl,
        });

        if (response?.success && response?.data) {
            setRefetchMe(!refetchMe)
            Toast.remove(key);
            Toast.success(t("msg.UPDATE_PROFILE_SUCCESS"));
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.UPDATE_PROFILE_FAILED"));
        }
    };

    const onUpdateCitizenIdentification = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        let imageUrl = me?.citizen_identification?.citizen_identification_image;
        if (citizenIdentification) {
            imageUrl = await handleUploadAvatar(citizenIdentification, 'CITIZEN_IDENTIFICATION');
        }
        if (imageUrl !== null && citizenIdentification) {
            const recognitionData = new FormData();
            recognitionData.append("image", {
                uri: citizenIdentification.uri,
                type: citizenIdentification.type,
                name: citizenIdentification.fileName,
            });
            const res = await handleRecognizeCitizenIdentification(recognitionData);
            if (res?.success) {
                let dob = res?.data?.dob || "";
                if (dob) {
                    const [day, month, year] = dob.split('/');
                    dob = `${year}-${month}-${day}`;
                }
                let doe = res?.data?.doe || "";
                if (doe) {
                    const [day, month, year] = doe.split('/');
                    doe = `${year}-${month}-${day}`;
                }
                const updateResponse = await updateCitizenLicense({
                    identification_number: res?.data?.id || "",
                    issued_date: doe,
                    issued_location: res?.data?.address_entities?.province || "",
                    permanent_address: res?.data?.address || "",
                    contact_address: res?.data?.address || "",
                    identification_image_url: imageUrl ?? "",
                })
                if (updateResponse?.success) {
                    Toast.remove(key);
                    setRefetchMe(!refetchMe)
                    Toast.success(t("msg.UPDATE_CITIZEN_IDENTIFICATION_SUCCESS"), 1);
                } else {
                    Toast.remove(key);
                    Toast.fail(t("msg.UPDATE_CITIZEN_IDENTIFICATION_FAILED"), 1);
                }
            } else {
                Toast.remove(key);
                Toast.fail(t("msg.RECOGINZE_FAIL"), 1);
            }
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.UPDATE_CITIZEN_IDENTIFICATION_FAILED"), 1);
        }
    }

    const onUpdateDriverLicense = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        let imageUrl = me?.citizen_identification?.citizen_identification_image;
        if (driverLicense) {
            imageUrl = await handleUploadAvatar(driverLicense, 'DRIVER_LICENSE');
        }
        if (imageUrl !== null && driverLicense) {
            const recognitionData = new FormData();
            recognitionData.append("image", {
                uri: driverLicense.uri,
                type: driverLicense.type,
                name: driverLicense.fileName,
            });
            const res = await handleRecognizeLicensePlate(recognitionData);
            if (res?.success) {
                let dob = res?.data?.dob || "";
                if (dob) {
                    const [day, month, year] = dob.split('/');
                    dob = `${year}-${month}-${day}`;
                }
                const updateResponse = await updateLicense({
                    id: res?.data?.id || "",
                    full_name: res?.data?.name || "",
                    dob: dob,
                    license_image_url: imageUrl ?? "",
                })
                if (updateResponse?.success) {
                    Toast.remove(key);
                    Toast.success(t("msg.UPDATE_LICENSE_SUCCESS"));
                    setRefetchMe(!refetchMe);
                } else {
                    Toast.remove(key);
                    Toast.fail(t("msg.UPDATE_LICENSE_FAILED"));
                }
            } else {
                Toast.remove(key);
                Toast.fail(t("msg.RECOGNIZE_FAIL"), 1);
            }
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.UPDATE_CITIZEN_IDENTIFICATION_FAILED"), 1);
        }
    }

    const handleSyncWallet = async () => {
        if (isConnected && address) {
            const key = Toast.loading({
                content: t('common.processing'),
                duration: 0,
                mask: true
            });
            const response = await updateMetamaskAddress(address);
            if (response?.success) {
                Toast.remove(key);
                Toast.success(t("msg.SYNC_WALLET_SUCCESS"), 1);
            } else {
                Toast.remove(key);
                Toast.fail(t("msg.SYNC_WALLET_FAILED"), 1);
            }
        } else {
            await open()
        }
    }


    const handleDepositTokens = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        if (!isConnected) {
            Toast.remove(key);
            await open();
        } else {
            const response = await buyToken();
            if (response?.success) {
                const vnpayUrl = response?.data
                if (vnpayUrl) {
                    Toast.remove(key);
                    navigation.navigate('PAYMENT_VNPAY', { url: vnpayUrl });
                }
            } else {
                Toast.remove(key);
                Toast.fail('Deposit token failed');
            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 20
            }}>
                <View className='justify-center'>
                    <Flex align='center' justify='center'>
                        <TouchableOpacity onPress={() => handleImagePicker('avatar')} className='relative'>
                            <Image
                                source={{ uri: avatar?.uri || me?.image_url }}
                                className='object-cover w-32 h-32 rounded-full'
                            />
                            <Icon name="camera" size={24} style={{ position: 'absolute', bottom: 0, right: 0 }} />
                        </TouchableOpacity>
                    </Flex>
                    <Divider className='mt-2'></Divider>
                    <List renderHeader={t("account.settings.information")}>
                        <InputItem
                            value={displayName}
                            onChange={(value) => setDisplayName(value)}
                            placeholder={t("account.settings.display_name")}
                        />
                        <InputItem
                            value={phoneNumber}
                            onChange={(value) => setPhoneNumber(value)}
                            placeholder={t("account.settings.phoneNumber")}
                            type="phone"
                        />
                        <List.Item
                            onPress={() => {
                                setLanguageDialogVisible(true);
                            }}
                            extra={
                                <Paragraph>{t(i18n.language === 'en' ? 'common.language.english' : 'common.language.vietnamese')}</Paragraph>
                            }
                        >
                            {t("account.settings.language")}
                        </List.Item>
                        <List.Item
                            onPress={handleSyncWallet}
                            extra={
                                <Pressable>{t('common.sync')}</Pressable>
                            }
                        >
                            {t("account.settings.sync_wallet")}
                        </List.Item>
                        <List.Item
                            onPress={handleDepositTokens}
                            extra={
                                <Pressable>{t("common.deposit")}</Pressable>
                            }
                        >
                            <Text>{t("common.balance")}: {Number(balance).toFixed(2)}</Text>
                        </List.Item>
                        <Button
                            type="primary"
                            onPress={onUpdateProfile}
                            style={{ margin: 20 }}
                        >
                            {t("common.updateProfile")}
                        </Button>
                    </List>
                    <Divider className='mt-2'></Divider>
                    <List renderHeader={t("account.settings.citizen_identification")}>
                        <TouchableOpacity disabled={!isEmpty(me?.citizen_identification?.citizen_identification_number)} onPress={() => handleImagePicker('citizen_identification')} className='relative'>
                            <Image
                                source={{ uri: citizenIdentification?.uri || me?.citizen_identification?.citizen_identification_image }}
                                className='object-cover w-full h-[200px]'
                            />
                        </TouchableOpacity>
                        <Button
                            type="primary"
                            onPress={onUpdateCitizenIdentification}
                            style={{ margin: 20 }}
                            disabled={!citizenIdentification?.uri || !isEmpty(me?.citizen_identification?.citizen_identification_number)}
                        >
                            {t("common.updateCitizenIdentification")}
                        </Button>
                    </List>
                    <Divider className='mt-2'></Divider>
                    <List renderHeader={t("account.settings.driver_license")}>
                        <TouchableOpacity disabled={!isEmpty(me?.car_license?.license_image_url)} onPress={() => handleImagePicker('driver_license')} className='relative'>
                            <Image
                                source={{ uri: driverLicense?.uri || me?.car_license?.license_image_url }}
                                className='object-cover w-full h-[200px]'
                            />
                        </TouchableOpacity>
                        <Button
                            type="primary"
                            onPress={onUpdateDriverLicense}
                            style={{ margin: 20 }}
                            disabled={!driverLicense?.uri || !isEmpty(me?.car_license?.license_image_url)}
                        >
                            {t("common.updateDriverLicense")}
                        </Button>
                    </List>
                </View>
                {languageDialogVisible && (
                    <LanguageDialog
                        languageDialogVisible={languageDialogVisible}
                        setLanguageDialogVisible={setLanguageDialogVisible}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccountSettings;