import { View, Text, ScrollView, Image } from 'react-native';
import React, { useMemo, useState } from 'react';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { GET_CAR_BY_ID } from '../../store/car/action';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { calculateDays, convertDateToTimestamp, formatDate, formatPrice } from '../../utils';
import { Button } from 'react-native-elements';
import { DatePicker, Picker, Toast } from '@ant-design/react-native';
import { provinces } from '../../constants';
import Gallery from '../../components/gallery';
import { handleRentRequest } from '../../store/rental/handlers';
import { useTranslation } from 'react-i18next';

const RentCar = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const { carId } = route.params as { carId: string };
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { carDetail } = useSelector((state: RootState) => state.car);
    const { car, reviews, related_cars } = carDetail;
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [province, setProvince] = useState('');

    const provinceOptions = provinces.map(province => ({
        label: province.enName,
        value: province.enName
    }));

    useMemo(() => {
        if (carId) {
            dispatch({ type: GET_CAR_BY_ID, payload: carId });
        }
    }, [carId]);

    const handleRentCar = async () => {
        let isValid = true;
        if (convertDateToTimestamp(startDate) >= convertDateToTimestamp(endDate)) {
            Toast.show({
                content: 'End date must be greater than start date',
                duration: 2,
                position: 'top',
                icon: 'fail'
            });
            isValid = false;
            return;
        } else if (!province) {
            Toast.show({
                content: 'Please select province',
                duration: 2,
                position: 'top',
                icon: 'fail'
            });
            isValid = false;
            return;
        }
        if (isValid) {
            const key = Toast.loading({
                content: t('common.processing'),
                duration: 0,
                mask: true
            });
            const response = await handleRentRequest(carId, convertDateToTimestamp(startDate), convertDateToTimestamp(endDate), province);
            if (response?.success) {
                Toast.remove(key);
                Toast.show({
                    content: 'Rent car successfully',
                    duration: 2,
                    position: 'top',
                    icon: 'success'
                });
                navigation.navigate('MY_TRIP');
            } else {
                Toast.show({
                    content: 'Rent car failed',
                    duration: 2,
                    position: 'top',
                    icon: 'fail'
                });
            }
        }
    };

    const numberOfDays = useMemo(() => {
        return calculateDays(convertDateToTimestamp(startDate), convertDateToTimestamp(endDate));
    }, [startDate, endDate]);

    if (!car) return null;
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
                {/* Image Carousel */}
                <View>
                    <Image
                        source={{ uri: car.image_url[0] ?? 'https://picsum.photos/200/300' }}
                        className="w-full h-64"
                        resizeMode="cover"
                    />
                    <View className="absolute top-0 left-0 m-2">
                        <Icon name="arrowleft" color="white" size={28} onPress={() => navigation.goBack()} />
                    </View>
                </View>
                <View className="p-4">
                    <Text className="text-lg font-bold text-text8">{car.name}</Text>
                    <Text className="mt-2 text-sm text-text3">
                        {carDetail.car.description}
                    </Text>
                </View>
                <Gallery carImages={car.image_url}></Gallery>
                <View className="flex flex-col p-4 gap-y-3">
                    <View>
                        <Text>Select Start Date:</Text>
                        <DatePicker
                            value={startDate}
                            precision='minute'
                            onChange={setStartDate}
                        >
                            <Text className="p-2 border border-gray-300 rounded">{formatDate(startDate)}</Text>
                        </DatePicker>
                    </View>
                    <View>
                        <Text>Select End Date:</Text>
                        <DatePicker
                            value={endDate}
                            precision='minute'
                            onChange={setEndDate}
                        >
                            <Text className="p-2 border border-gray-300 rounded">{formatDate(endDate)}</Text>
                        </DatePicker>
                    </View>
                    <View>
                        <Text>Select Province:</Text>
                        <Picker
                            data={provinceOptions}
                            cols={1}
                            value={[province]}
                            onChange={(value) => setProvince(value[0] as string)}
                        >
                            <Text className="p-2 border border-gray-300 rounded">{province || 'Select Province'}</Text>
                        </Picker>
                    </View>
                </View>
            </ScrollView>
            <View className="flex-row items-center justify-between p-4 border-t border-gray-200">
                <Text className="text-lg font-bold text-semiPrimary">{formatPrice(car?.daily_rate * numberOfDays)} VNĐ</Text>
                <Button title="Rent car" type='solid' onPress={handleRentCar} />
            </View>
        </SafeAreaView>
    );
};

export default RentCar;