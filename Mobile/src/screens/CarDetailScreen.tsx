import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import { Button, Card, Avatar, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { GET_CAR_BY_ID } from '../store/car/action';
import { RootState } from '../store/configureStore';
import Review from '../modules/car/Review';
import { formatPrice } from '../utils';
import Gallery from '../components/gallery';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { RenderHTML } from 'react-native-render-html';
import { useTranslation } from 'react-i18next';

export default function CarDetailScreen() {
    const { t } = useTranslation();
    const route = useRoute();
    const { carId } = route.params as { carId: string };
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const dispatch = useDispatch();
    const { carDetail } = useSelector((state: RootState) => state.car);
    const { car, reviews, related_cars } = carDetail;
    const { width } = useWindowDimensions();

    useMemo(() => {
        if (carId) {
            dispatch({ type: GET_CAR_BY_ID, payload: carId });
        }
    }, [carId])

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

                {/* Car Title and Description */}
                <View className="p-4">
                    <Text className="text-lg font-bold text-text8">{car.name}</Text>
                    <RenderHTML contentWidth={width} source={{ html: car?.description }} />
                </View>

                {/* Car Details */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-text8">{t("common.carDetail")}</Text>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">{t("car.fuel")}</Text>
                        <Text className="text-sm font-bold text-gray-900">{t(`car.${car?.fuel?.toLowerCase()}`)}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">{t("common.carStatus")}</Text>
                        <Text className="text-sm font-bold text-gray-900">{t(`common.${car?.status?.toLowerCase()}`)}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">{t("car.fuel_consumption")}</Text>
                        <Text className="text-sm font-bold text-gray-900">{car?.fuel_consumption} {t("common.litersPer100km")}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">{t("car.seat")}</Text>
                        <Text className="text-sm font-bold text-gray-900">{car.seat}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">{t("car.transmission")}</Text>
                        <Text className="text-sm font-bold text-gray-900">{car?.transmission === "MANUAL" ? t("car.manual") : t("car.automatic")}</Text>
                    </View>
                </View>

                {/* Car gallery */}

                <Gallery
                    carImages={car.image_url}
                ></Gallery>

                <Divider />

                {/* Host Detail */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-gray-900">{t("common.carOwner")}</Text>
                    <View className="flex-row items-center mt-2">
                        <Avatar rounded source={{ uri: car?.owner?.image_url ?? 'https://randomuser.me/api/portraits/men/85.jpg' }} size="medium" />
                        <View className="ml-4">
                            <Text className="text-sm font-bold text-gray-900">{car?.owner?.display_name}</Text>
                            <Text className="text-xs text-gray-600">Email: {car?.owner?.email}</Text>
                            <Text className="text-xs text-gray-600">{t("account.settings.phoneNumber")}: {car?.owner?.phone_number}</Text>
                            <Text className="text-xs text-gray-600">Ho Chi Minh, Viet Nam</Text>
                        </View>
                        {/* <View className="ml-auto">
                            <Button title="Contact" type='outline' className='text-lite bg-thirdly' onPress={() => { }} />
                        </View> */}
                    </View>
                </View>

                <Divider />

                {/* Reviews Section */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-gray-900">{t("account.rent_contract.review")} ({reviews.length})</Text>
                    {reviews.map((review, index) => (
                        <Review
                            key={review.id}
                            review={review}
                        ></Review>
                    ))}
                    {/* <Text className="mt-4 text-xs text-blue-500">See more review</Text> */}
                </View>
            </ScrollView>

            {/* Footer Section */}
            <View className="flex-row items-center justify-between p-4 border-t border-gray-200">
                <Text className="text-lg font-bold text-semiPrimary">{formatPrice(car.daily_rate)} VNĐ / {t("common.day")}</Text>
                <Button title={t("common.rentNow")} type='solid' onPress={() => {
                    navigation.navigate('RENT_CAR_SCREEN', { carId: car.id })
                }} />
            </View>
        </SafeAreaView>
    );
}
