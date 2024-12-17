import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICar } from '../../store/car/types';
import { formatPrice } from '../../utils';
import { Button, Carousel, Flex } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';

const CarCard = ({ car, isFullWidth = false, isAdmin = false, onDelete }: { car: ICar, isFullWidth: boolean, isAdmin?: boolean, onDelete?: (id: string) => void }) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { t } = useTranslation();

    const onHorizontalSelectedIndexChange = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <Card containerStyle={{ width: isFullWidth ? 320 : 200, padding: 0, borderRadius: 10, marginRight: 10 }}>
            <Carousel
                style={{ height: isFullWidth ? 200 : 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                selectedIndex={selectedIndex}
                autoplay
                infinite
                afterChange={onHorizontalSelectedIndexChange}
            >
                {car.image_url.map((url, index) => (
                    <Pressable onPress={() => navigation.navigate('CAR_DETAIL_SCREEN', { carId: car.id })}>
                        <Image
                            key={index}
                            source={{ uri: url ?? 'https://picsum.photos/200/300' }}
                            style={{ height: isFullWidth ? 200 : 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                            resizeMode="cover"
                        />
                    </Pressable>
                ))}
            </Carousel>
            <View style={{ padding: 10 }}>
                <Flex align='center' justify={isAdmin ? 'between' : 'start'}>
                    <View>
                        <Text style={{ fontWeight: 'bold', maxWidth: 180 }} className='w-full h-5 line-clamp-2'>{car.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Icon name="star" size={16} color="#FFD700" />
                            <Text style={{ marginLeft: 5 }}>{car.average_rating}</Text>
                        </View>
                        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                            <Text className='font-bold text-semiPrimary'>{formatPrice(car.daily_rate)} VNĐ</Text> / {t('common.day')}
                        </Text>
                    </View>
                    {isAdmin && (<Flex align='center' justify='center' style={{ gap: 10 }}>
                        <Button type='warning' onPress={() => onDelete && onDelete(car?.id)}>
                            <Icon name="delete" color={"#FFF"} size={16}></Icon>
                        </Button>
                        <Button type='primary' onPress={() => navigation.navigate('EDIT_CAR_SCREEN', { carId: car.id })}>
                            <Icon name="edit" color={"#FFF"} size={16}></Icon>
                        </Button>
                    </Flex>)}
                </Flex>
            </View>
        </Card>
    );
};

export default CarCard;