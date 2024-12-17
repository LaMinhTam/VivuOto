import { View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Flex } from '@ant-design/react-native';

const ProfileCardSkeleton = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const shimmerStyle = {
        opacity: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        }),
    };

    return (
        <View className="flex-row items-center p-4 mb-6 bg-blue-500 rounded-xl">
            <Flex direction='row'>
                <Animated.View style={[{ width: 48, height: 48, borderRadius: 24 }, shimmerStyle]} className="bg-gray-300" />
                <View style={{ marginLeft: 16 }}>
                    <Animated.View style={[{ width: 120, height: 20, marginBottom: 6, borderRadius: 4 }, shimmerStyle]} className="bg-gray-300" />
                    <Animated.View style={[{ width: 180, height: 20, marginBottom: 6, borderRadius: 4 }, shimmerStyle]} className="bg-gray-300" />
                    <Animated.View style={[{ width: 100, height: 20, borderRadius: 4 }, shimmerStyle]} className="bg-gray-300" />
                </View>
                <Animated.View style={[{ width: 100, height: 40, borderRadius: 20, marginLeft: 10 }, shimmerStyle]} className="bg-gray-300" />
            </Flex>
        </View>
    );
};

export default ProfileCardSkeleton;