import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Button } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { FormInstance } from '@ant-design/react-native/lib/form';
import { ICreateCarData } from '../../../store/car/types';
import Icon from 'react-native-vector-icons/Ionicons';

const CarImageTab = ({ screenShot, setScreenShot }: {
    screenShot: Asset[],
    setScreenShot: React.Dispatch<React.SetStateAction<Asset[]>>
}) => {
    const { t } = useTranslation();

    const handleImagePicker = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 10 - screenShot.length,
            },
            (response) => {
                if (response.assets) {
                    setScreenShot(prev => [...prev, ...response.assets as Asset[]]);
                }
            }
        );
    };

    const handleRemoveImage = (uri: string) => {
        const newScreenShot = screenShot.filter(image => image.uri !== uri);
        setScreenShot(newScreenShot);
    };

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                {t('car.image_url')}
            </Text>
            <ScrollView
                horizontal
                contentContainerStyle={{ flexDirection: 'row', marginBottom: 16 }}
            >
                {screenShot.map((asset, index) => (
                    <View key={index} style={{ position: 'relative', marginRight: 8 }}>
                        <Image
                            source={{ uri: asset.uri }}
                            style={{ width: 100, height: 100, borderRadius: 8 }}
                        />
                        <TouchableOpacity
                            onPress={() => handleRemoveImage(asset.uri as string)}
                            style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: 12,
                                padding: 4
                            }}
                        >
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <Button
                type="primary"
                onPress={handleImagePicker}
                disabled={screenShot.length >= 10}
            >
                {t('profile.my_cars.upload_image')}
            </Button>

            <Text style={{ marginTop: 8, color: 'gray', fontStyle: 'italic' }}>
                {t('profile.my_cars.image_note', { max: 10 })}
            </Text>
        </View>
    );
};

export default CarImageTab;
