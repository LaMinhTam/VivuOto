import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import { PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/configureStore';
import { getTokens } from './utils/auth';
import TabNavigator from './modules/navigator/TabNavigator';
import { Provider as AntdProvider } from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US'
import {
  WalletConnectModal,
} from '@walletconnect/modal-react-native';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import messaging from '@react-native-firebase/messaging';
import { subscribeDevice } from './store/auth/handlers';
import { PermissionsAndroid } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isRecheckToken } = useSelector((state: RootState) => state.auth);
  const [tokens, setTokens] = useState({
    accessToken: '',
    refreshToken: ''
  });
  useEffect(() => {
    const fetchTokens = async () => {
      const retrievedTokens = await getTokens();
      setTokens({
        accessToken: retrievedTokens?.accessToken || '',
        refreshToken: retrievedTokens?.refreshToken || ''
      });
    };

    fetchTokens();
  }, [isRecheckToken]);





  // useEffect(() => {
  //   const requestUserPermission = async () => {
  //     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  //     const authStatus = await messaging().requestPermission();
  //     console.log("requestUserPermission ~ authStatus:", authStatus)
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //       try {
  //         console.log('Attempting to get FCM token...');
  //         const token = await messaging().getToken();
  //         console.log('FCM token retrieved successfully');
  //         console.log('FCM token:', token);
  //       } catch (error) {
  //         console.error('Error getting FCM token:', error);
  //       }
  //     }
  //   };

  //   requestUserPermission();
  // }, [messaging])

  return (
    <Stack.Navigator>
      {tokens.accessToken ? (
        <Stack.Screen name="MAIN_SCREEN" component={TabNavigator} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name='LOGIN_SCREEN' component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name='REGISTER_SCREEN' component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name='VERIFY_CODE_SCREEN' component={VerifyCodeScreen} options={{ headerShown: false }} />
          <Stack.Screen name='FORGOT_PASSWORD_SCREEN' component={ForgotPasswordScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

const providerMetadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'vcarapp://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

export default function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <AntdProvider locale={enUS}>
            <WalletConnectModal
              explorerRecommendedWalletIds={[
                'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
              ]}
              explorerExcludedWalletIds={'ALL'}
              projectId={process.env.VITE_WALLET_CONNECT_PROJECT_ID || ''}
              providerMetadata={providerMetadata}
            />
            <RootNavigator />
          </AntdProvider>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
