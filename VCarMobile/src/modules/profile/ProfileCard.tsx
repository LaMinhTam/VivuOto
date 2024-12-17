import { View, Text } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { Flex } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import { IUser } from '../../store/auth/types';

const ProfileCard = ({ me, balance }: {
    me: IUser,
    balance: number
}) => {
    const { t } = useTranslation();
    return (
        <View className="flex-row items-center p-4 mb-6 bg-blue-500 rounded-xl">
            <Flex direction='row'>
                <Image
                    source={{ uri: me?.image_url }}
                    className="object-contain w-12 h-12 mr-4 rounded-full"
                />
                <View>
                    <Text className="font-bold text-white">{me?.display_name}</Text>
                    <Text className="text-white">{me?.phone_number}</Text>
                    <Text className='text-white'>{t("common.balance")}: {Number(balance).toFixed(2)}</Text>
                </View>
            </Flex>
        </View>
    )
}

export default ProfileCard