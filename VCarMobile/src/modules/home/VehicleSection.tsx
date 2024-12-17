import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ICar, IQuerySearchCar } from '../../store/car/types';
import { convertDateToTimestamp } from '../../utils';
import CarCard from '../car/CarCard';
import CardSkeleton from '../../components/common/CardSkeleton';
import { QuerySearchCar } from '../../store/car/models';
import { useTranslation } from 'react-i18next';
import { searchCarHomePage } from '../../store/car/handlers';
import { Toast } from '@ant-design/react-native';

const VehicleSection = ({ title, type }: {
    title: string
    type: string,
}) => {
    const [cars, setCars] = useState<ICar[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const [params, setParams] = useState<IQuerySearchCar>({
        ...QuerySearchCar,
        rentalStartDate: convertDateToTimestamp(new Date().toDateString()),
        rentalEndDate: convertDateToTimestamp(new Date(new Date().setDate(new Date().getDate() + 2)).toDateString()),
    });
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await searchCarHomePage(params);
            if (response?.success) {
                setCars(response.data);
                setLoading(false);
            } else {
                Toast.fail(t("msg.SYSTEM_MAINTENANCE"))
                setLoading(false);
            }
        }
        fetchData();
    }, [params]);
    useEffect(() => {
        switch (type) {
            case "popular":
                setParams({ ...params, size: 4, maxRate: 1000000, rating: 5 });
                break;
            case "recommend":
                setParams({ ...params, size: 4, rating: 5, province: "Ho_Chi_Minh" });
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                {/* <Text style={{ color: '#1E90FF' }}>See all</Text> */}
            </View>
            <ScrollView className='mb-4' horizontal showsHorizontalScrollIndicator={false}>
                {!loading && cars.length > 0 && cars.map((car, index) => (
                    <CarCard
                        key={car.id}
                        car={car}
                        isFullWidth={false}
                    ></CarCard>
                ))}
                {loading && Array.from({ length: 10 }).map((_, index) => (
                    <CardSkeleton
                        key={index}
                        isFullWidth
                    ></CardSkeleton>
                ))}
            </ScrollView>
        </>

    )
}

export default VehicleSection