import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { List, Toast } from '@ant-design/react-native';
import { Text, ActivityIndicator, Menu, Divider, Avatar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getListNotifications, handleMakeNotificationAsRead } from '../store/auth/handlers';
import { NotificationParams } from '../store/auth/models';
import { INotificationParams, INotification } from '../store/auth/types';
import { formatDate } from '../utils';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const NotificationScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState<INotificationParams>(NotificationParams);
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();


    const fetchNotifications = async () => {
        setLoading(true);
        const response = await getListNotifications(params);
        if (response?.success && response.data) {
            let newNotifications = response?.data?.filter((item: INotification) => item.type === 'RENTAL_REQUEST')
            setNotifications(prev => [...prev, ...newNotifications]);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setNotifications([]);
        // setParams(NotificationParams);
        await fetchNotifications();
        setRefreshing(false);
    }, []);

    useMemo(() => {
        fetchNotifications();
    }, [params]);

    const handleMakeMessageAsRead = async (id: string) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const response = await handleMakeNotificationAsRead(id);
        if (response?.success) {
            Toast.remove(key);
            const newNotifications = notifications.map(item =>
                item.id === id ? response.data : item
            );
            setNotifications(newNotifications);
        } else {
            Toast.remove(key);
            Toast.fail(t('SYSTEM_MAINTENANCE'), 1);
        }
    };
    const handleNavigateRentalDetail = (item: INotification) => {
        // const data = handleFormatLink(item.message, item.target_id)
        if (item.message === 'NEW_RENTAL_REQUEST') {
            navigation.navigate('RENTAL_DETAIL', { requestId: item.target_id, type: 'LESSOR' })
        } else {
            navigation.navigate('RENTAL_DETAIL', { requestId: item.target_id, type: 'LESSEE' })
        }
    }

    const vivuOtoLogo = require('../../public/VivuOto_logo.png');

    const renderItem = ({ item }: { item: INotification }) => (
        <TouchableOpacity onPress={() => handleNavigateRentalDetail(item)}>
            <List.Item
                className={`px-4 py-2 ${item?.read ? '' : 'bg-gray-100'}`}
                thumb={
                    <Image
                        source={vivuOtoLogo}
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                }
                extra={
                    <Menu
                        visible={true}
                        onDismiss={() => setNotifications(prev =>
                            prev.map(n => n.id === item.id ? { ...n, menuVisible: false } : n)
                        )}
                        anchor={
                            <TouchableOpacity onPress={() => setNotifications(prev =>
                                prev.map(n => n.id === item.id ? { ...n, menuVisible: true } : n)
                            )}>
                                <Text>⋮</Text>
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item onPress={() => handleMakeMessageAsRead(item.id)} title={t('common.markAsRead')} />
                    </Menu>
                }
            >
                <List.Item.Brief>
                    <Text className="mb-1 font-bold">VivuOto</Text>
                    <Text>{t(`msg.${item.message}`)}</Text>
                    <Text className="mt-1 text-blue-500">{formatDate(item?.created_at)}</Text>
                </List.Item.Brief>
            </List.Item>
        </TouchableOpacity>
    );


    return (
        <View className="flex-1 bg-white">
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0000ff']} // Android
                        tintColor="#0000ff" // iOS
                    />
                }
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <Divider />}
                onEndReached={() => setParams(prev => ({ ...prev, size: prev.size + 10 }))}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={() =>
                    <View className="items-center justify-center flex-1">
                        <Text>{t('common.empty')}</Text>
                    </View>
                }
                ListFooterComponent={() =>
                    loading ? <ActivityIndicator className="py-4" /> : null
                }
            />
        </View>
    );
};

export default NotificationScreen;