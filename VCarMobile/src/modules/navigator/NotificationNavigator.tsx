import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationScreen from '../../screens/ConversationScreen';
import { ScreenOptions } from '../../constants';
import NotificationScreen from '../../screens/NotificationScreen';
import RentalDetail from '../profile/RentalDetail';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const NotificationNavigator = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="NOTIFICATION_SCREEN"
                component={NotificationScreen}
                options={{ ...ScreenOptions.notification, }}
            />
            <Stack.Screen
                name="RENTAL_DETAIL"
                component={RentalDetail}
                options={{
                    title: t("common.rentalOrderDetail"),
                }}
            />
        </Stack.Navigator>
    )
}

export default NotificationNavigator