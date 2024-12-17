import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CarScreen from '../../screens/CarScreen';
import { ScreenOptions } from '../../constants';
import CarDetailScreen from '../../screens/CarDetailScreen';
import RentCar from '../car/RentCar';

const Stack = createNativeStackNavigator();

const CarNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CAR_SCREEN"
                component={CarScreen}
                options={{ ...ScreenOptions.car, }}
            />
            <Stack.Screen
                name="CAR_DETAIL_SCREEN"
                component={CarDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RENT_CAR_SCREEN"
                component={RentCar}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default CarNavigator