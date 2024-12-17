import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import CarScreen from '../../screens/CarScreen';
import { ScreenOptions } from '../../constants';
import ConversationScreen from '../../screens/ConversationScreen';
import PersonalScreen from '../../screens/PersonalScreen';
import HomeNavigator from './HomeNavigator';
import CarNavigator from './CarNavigator';
import ConversationNavigator from './ConversationNavigator';
import PersonalNavigator from './PersonalNavigator';
import NotificationNavigator from './NotificationNavigator';
import { Badge } from '@ant-design/react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIconStyle: { alignItems: 'center', justifyContent: 'center' },
            }}
        >
            <Tab.Screen
                name="HOME_TAB"
                component={HomeNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="home"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        navigation.navigate('HOME_SCREEN');
                    },
                })}
            />
            <Tab.Screen
                name="CAR_TAB"
                component={CarNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="car"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        navigation.navigate('CAR_SCREEN');
                    },
                })}
            />
            {/* <Tab.Screen
                name="CONVERSATION_TAB"
                component={ConversationNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="chatbox"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
            /> */}
            <Tab.Screen
                name="NOTIFICATION_TAB"
                component={NotificationNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Badge dot>
                            <IconMaterial
                                name="bell-outline"
                                size={24}
                                color={focused ? 'blue' : 'black'}
                            />
                        </Badge>
                    ),
                    tabBarLabel: '',
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        navigation.navigate('NOTIFICATION_SCREEN');
                    },
                })}
            />
            <Tab.Screen
                name="PERSONAL_TAB"
                component={PersonalNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="person"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        navigation.navigate('PERSONAL_SCREEN');
                    },
                })}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
