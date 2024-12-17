import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const LayoutMain = ({ children, refreshControl }: {
    refreshControl?: any,
    children: React.ReactNode
}) => {
    const { t } = useTranslation()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={{ flex: 1, padding: 16 }} refreshControl={refreshControl}>
                {/* Header Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>{t("common.location")}</Text>
                            <Icon name="chevron-down" size={16} color="black" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Ho Chi Minh City, VN</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Icon name="search-outline" size={28} color="black" />
                    </View>
                </View>
                {children}
            </ScrollView>
        </SafeAreaView>
    )
}

export default LayoutMain