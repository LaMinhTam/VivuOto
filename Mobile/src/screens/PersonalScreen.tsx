import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import LayoutMain from '../layouts/LayoutMain';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { GET_ME } from '../store/profile/action';
import { removeTokens } from '../utils/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { getWalletBalance } from '../utils';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import ProfileCard from '../modules/profile/ProfileCard';
import ProfileCardSkeleton from '../components/common/ProfileCardSkeleton';
import { setIsReCheckToken } from '../store/auth/reducers';
import { useTranslation } from 'react-i18next';

const PersonalScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { me, loading } = useSelector((state: RootState) => state.profile);
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [balance, setBalance] = useState(0);
    const { open, isConnected, address, provider } = useWalletConnectModal();

    const handleLogout = async () => {
        await removeTokens();
        dispatch(setIsReCheckToken(!isRecheckToken));
        if (isConnected) {
            await provider?.disconnect();
        }
    }

    useEffect(() => {
        dispatch({ type: GET_ME })
    }, [])

    async function fetchWalletBalance() {
        if (!isConnected) {
            await open();
        } else {
            const balance = await getWalletBalance(address ?? '', provider);
            setBalance(parseFloat(balance || '0'));
        }
    }

    useEffect(() => {
        fetchWalletBalance();
    }, [isConnected, address])

    useFocusEffect(
        useCallback(() => {
            fetchWalletBalance();
        }, [fetchWalletBalance])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch({ type: GET_ME });
        fetchWalletBalance();
        setRefreshing(false);
    }, []);

    return (
        <LayoutMain refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']} // Android
            tintColor="#0000ff" // iOS
        />}>
            <Text className="mb-4 text-2xl font-bold text-text8">{t("common.profile")}</Text>

            {/* Thẻ Profile */}
            {loading ? <ProfileCardSkeleton /> : <ProfileCard
                me={me}
                balance={balance}
            />}

            {/* Danh sách chức năng */}
            <View className="space-y-4">
                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("ACCOUNT_SETTINGS_SCREEN", { balance })}>
                    <Icon name="account-circle" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">{t("account.settings")}</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("MY_CARS", { refetchCars: true })}>
                    <Icon name="drive-eta" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">{t("account.my_cars")}</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("MY_TRIP")}>
                    <Icon name="tour" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">{t("account.my_trips")}</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("MY_LESSEE_SCREEN")}>
                    <Icon name="accessibility" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">{t("account.my_lessee")}</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("CHANGE_PASSWORD_SCREEN")}>
                    <Icon name="lock" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">{t("account.change_password")}</Text>
                </TouchableOpacity>
            </View>

            {/* Nút Logout */}
            <View className='fixed bottom-[-30px] left-0 right-0'>
                <Button
                    title={t("common.logout")}
                    buttonStyle={{
                        backgroundColor: '#103F74',
                        borderRadius: 30,
                        paddingVertical: 12,
                    }}
                    titleStyle={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }}
                    onPress={handleLogout}
                />
            </View>
        </LayoutMain>
    );
};

export default PersonalScreen;