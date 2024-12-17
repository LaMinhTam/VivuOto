import { View, Text, StyleSheet, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Toast } from '@ant-design/react-native';
import StepIndicator from 'react-native-step-indicator';
import { useTranslation } from 'react-i18next';
import CarInformationTab from './CarInformationTab';
import CarFeatureTab from './CarFeatureTab';
import CarImageTab from './CarImageTab';
import CarLicenseTab from './CarLicenseTab';
import RentFeeTab from './RentFeeTab';
import { ICreateCarData } from '../../../store/car/types';
import CarDescTab from './CarDescTab';
import { RichEditor } from 'react-native-pell-rich-editor';
import moment from 'moment';
import { Asset } from 'react-native-image-picker';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { getWalletBalance, handleUploadFile, sendTransaction } from '../../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/configureStore';
import { createCar } from '../../../store/car/handlers';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

const vnLabel = ["Xe", "Chức năng", "Giấy tờ xe", "Hình ảnh", "Mô tả", "Phí thuê và chi phí khác"];
const enLabel = ["Car", "Feature", "License", "Image", "Description", "Fee"];
const TOTAL_STEPS = 6;
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#0068ff',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#0068ff',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#0068ff',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#0068ff',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#0068ff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#0068ff'
}

const CreateMyCar = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [screenShot, setScreenShot] = useState<Asset[]>([]);
    const [description, setDescription] = useState('');
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const richText = useRef<RichEditor>(null);
    const { address, provider, isConnected, open } = useWalletConnectModal();
    const { me } = useSelector((state: RootState) => state.profile);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const handleNext = () => {
        setCurrentStep((prevStep) => prevStep + 1);
        richText?.current?.dismissKeyboard();
    };

    const handleBack = () => {
        setCurrentStep((prevStep) => prevStep - 1);
        richText?.current?.dismissKeyboard();
    };

    const onSubmit = () => {
        form.submit();
    };

    const onFinish = async (values: ICreateCarData) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const newValues = { ...values, description };
        if (address) {
            const balance = await getWalletBalance(address, provider);
            if (balance !== null && parseFloat(balance) < 0.05) {
                Toast.remove(key);
                Toast.fail(t('error.wallet.not_enough'));
                return;
            } else {
                const transactionResult = await sendTransaction(provider, process.env.VITE_VCAR_OWNER_METAMASK_ADDRESS ?? '', '0.05', address ?? '');
                if (transactionResult.success) {
                    const files = screenShot.map((image) => ({
                        uri: image.uri,
                        type: image.type,
                        name: image.fileName
                    }));
                    if (files.length === 0) {
                        return;
                    } else {
                        const uploadPromises = files.map((file) => {
                            const timestamp = new Date().getTime();
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', process.env.VITE_CLOUDINARY_PRESET_NAME);
                            formData.append('folder', `users/${me?.id}/my_cars/img/${timestamp}`);
                            return handleUploadFile(formData);
                        });
                        const imageUrls = await Promise.all(uploadPromises);
                        if (imageUrls.length === files.length) {
                            newValues.image_url = imageUrls
                            const response = await createCar(newValues);
                            if (response.success) {
                                Toast.remove(key);
                                Toast.success(t('common.success'));
                                navigation.navigate('MY_CARS', { refetchCars: true });
                            } else {
                                Toast.remove(key);
                                Toast.fail('error.wallet.system');
                            }
                        } else {
                            Toast.remove(key);
                            Toast.fail('error.upload');
                        }
                    }
                } else {
                    Toast.remove(key);
                    Toast.fail(t('error.wallet.system'));
                }
            }
        } else {
            Toast.remove(key);
            Toast.fail(t('error.wallet.connect'));
            return open();
        }
    };

    const renderStepContent = (step: number) => {
        const stepStyles = step === currentStep ? {} : { display: 'none' as 'none' | 'flex' };
        switch (step) {
            case 0:
                return (
                    <View style={stepStyles}>
                        <CarInformationTab form={form} />
                    </View>
                );
            case 1:
                return (
                    <View style={stepStyles}>
                        <CarFeatureTab form={form} />
                    </View>
                );
            case 2:
                return (
                    <View style={stepStyles}>
                        <CarLicenseTab form={form} />
                    </View>
                );
            case 3:
                return (
                    <View style={stepStyles}>
                        <CarImageTab screenShot={screenShot} setScreenShot={setScreenShot} />
                    </View>
                );
            case 4:
                return (
                    <View style={stepStyles}>
                        <CarDescTab richText={richText} description={description} setDescription={setDescription} />
                    </View>
                );
            case 5:
                return (
                    <View style={stepStyles}>
                        <RentFeeTab form={form} />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentStep}
                labels={i18n.language === 'en' ? enLabel : vnLabel}
                stepCount={TOTAL_STEPS}
            />
            <Form
                form={form}
                onFinish={onFinish}
                style={{ flex: 1, backgroundColor: '#fff' }}
                initialValues={{
                    name: '',
                    seats: 0,
                    brand: '',
                    transmission: 'MANUAL',
                    province: '',
                    color: '#0068ff',
                    manufacturing_year: new Date().getFullYear(),
                    fuel: 'GASOLINE',
                    fuel_consumption: 0,
                    location: '',
                    features: [],
                    license_plate: '',
                    registration_number: '',
                    registration_date: moment(new Date()).format('YYYY-MM-DD').toString(),
                    registration_location: '',
                    images: [],
                    description: '',
                    daily_rate: 0,
                    mileage_limit_per_day: 0,
                    extra_mileage_charge: 0,
                    extra_hourly_charge: 0,
                    washing_price: 0,
                    deodorise_price: 0
                }}
            >
                {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                    <React.Fragment key={index}>{renderStepContent(index)}</React.Fragment>
                ))}
            </Form>
            <View style={styles.buttonContainer}>
                <Button disabled={currentStep === 0} onPress={handleBack} type='ghost'>{t('common.prev')}</Button>
                {currentStep < TOTAL_STEPS - 1 ? (
                    <Button onPress={handleNext} type='ghost'>{t('common.next')}</Button>
                ) : (
                    <Button onPress={onSubmit}>{t('profile.my_cars.submit')}</Button>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});

export default CreateMyCar;
