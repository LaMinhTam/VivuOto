import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonalScreen from '../../screens/PersonalScreen';
import { ScreenOptions } from '../../constants';
import MyTrip from '../profile/MyTrip';
import RentalDetail from '../profile/RentalDetail';
import Payment from '../profile/Payment';
import MyCars from '../profile/MyCars';
import { useTranslation } from 'react-i18next';
import CarDetailScreen from '../../screens/CarDetailScreen';
import EditMyCar from '../profile/my_cars/EditMyCar';
import CreateMyCar from '../profile/my_cars/CreateMyCar';
import AccountSettings from '../profile/account/AccountSettings';
import MyLessee from '../profile/my_lessee/MyLessee';
import ChangePassword from '../profile/change_password/ChangePassword';

const Stack = createNativeStackNavigator();

const PersonalNavigator = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PERSONAL_SCREEN"
                component={PersonalScreen}
                options={{ ...ScreenOptions.personal, }}
            />
            <Stack.Screen
                name="MY_CARS"
                component={MyCars}
                options={{
                    title: t('profile.my_cars.title'),
                }}
            />
            <Stack.Screen
                name="MY_TRIP"
                component={MyTrip}
                options={{
                    title: t("account.my_trips"),
                }}
            />
            <Stack.Screen
                name="RENTAL_DETAIL"
                component={RentalDetail}
                options={{
                    title: t("common.rentalOrderDetail"),
                }}
            />
            <Stack.Screen
                name="PAYMENT_VNPAY"
                component={Payment}
                options={{ ...ScreenOptions.personal, }}
            />

            <Stack.Screen
                name="CAR_DETAIL_SCREEN"
                component={CarDetailScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="CREATE_CAR_SCREEN"
                component={CreateMyCar}
                options={{
                    title: t('profile.my_cars.create'),
                }}
            />
            <Stack.Screen
                name="EDIT_CAR_SCREEN"
                component={EditMyCar}
                options={{
                    title: t('profile.my_cars.edit'),
                }}
            />
            <Stack.Screen
                name="ACCOUNT_SETTINGS_SCREEN"
                component={AccountSettings}
                options={{
                    title: t('account.settings.title'),
                }}
            />
            <Stack.Screen
                name="MY_LESSEE_SCREEN"
                component={MyLessee}
                options={{
                    title: t('account.my_lessee'),
                }}
            />
            <Stack.Screen
                name="CHANGE_PASSWORD_SCREEN"
                component={ChangePassword}
                options={{
                    title: t('account.change_password'),
                }}
            />

        </Stack.Navigator>
    )
}

export default PersonalNavigator