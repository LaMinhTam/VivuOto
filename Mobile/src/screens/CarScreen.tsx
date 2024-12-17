import { View, Text, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import LayoutMain from '../layouts/LayoutMain';
import { Button, Icon } from 'react-native-elements';
import FilterPopup from '../modules/car/FilterPopup';
import { QuerySearchCar } from '../store/car/models';
import { debounce } from 'lodash';
import CarCard from '../modules/car/CarCard';
import { ICar, IQuerySearchCar } from '../store/car/types';
import CardSkeleton from '../components/common/CardSkeleton';
import { useTranslation } from 'react-i18next';
import { searchCarHomePage } from '../store/car/handlers';
import { Toast } from '@ant-design/react-native';
import { convertDateToTimestamp } from '../utils';
import { IMetaData } from '../store/rental/types';

const CarScreen = () => {
    const { t } = useTranslation();
    const [search, setSearch] = React.useState('');
    const [filterVisible, setFilterVisible] = React.useState(false);
    const [searchParams, setSearchParams] = React.useState<IQuerySearchCar>({
        ...QuerySearchCar,
        rentalStartDate: convertDateToTimestamp(new Date().toDateString()),
        rentalEndDate: convertDateToTimestamp(new Date(new Date().setDate(new Date().getDate() + 2)).toDateString()),
    });
    const [cars, setCars] = React.useState<ICar[]>([]);
    const [meta, setMeta] = React.useState<IMetaData>({} as IMetaData)
    const [loading, setLoading] = React.useState(true);
    const searchKeyWordDebounce = debounce(() => {
        setSearchParams((prevParams) => ({ ...prevParams, query: search }));
    }, 500);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await searchCarHomePage(searchParams);
            if (response?.success) {
                setCars(response.data);
                setMeta(response.meta);
                setLoading(false);
            } else {
                Toast.fail(t("msg.SYSTEM_MAINTENANCE"))
                setLoading(false);
            }
        }
        fetchData();
    }, [searchParams]);

    useEffect(() => {
        searchKeyWordDebounce();
        return () => {
            searchKeyWordDebounce.cancel();
        };
    }, [search]);

    return (
        <LayoutMain>
            <View className="flex-row items-center justify-between p-4 bg-white">
                {/* Search Input */}
                <View className="flex-row items-center flex-1 px-4 py-2 mr-4 bg-gray-200 rounded-full">
                    <Icon
                        name="search"
                        type="feather"
                        size={20}
                        color="#9CA3AF"
                    />
                    <TextInput
                        className="flex-1 w-full h-10 ml-2 text-text2"
                        placeholder={t("common.searchCar")}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter Button */}
                <Button
                    icon={
                        <Icon
                            name="filter"
                            type="feather"
                            size={24}
                            color="white"
                        />
                    }
                    buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 50 }}
                    onPress={() => setFilterVisible(true)}
                />
            </View>
            <View className="flex flex-wrap p-4">
                {!loading && cars.length === 0 && <Text>{t("common.empty")}</Text>}
                {!loading && cars.length > 0 && cars.map((car: ICar) => (
                    <CarCard key={car.id} car={car} isFullWidth={false} />
                ))}
                {loading && Array.from({ length: 10 }).map((_, index) => (
                    <CardSkeleton
                        key={index}
                        isFullWidth={false}
                    ></CardSkeleton>
                ))}
            </View>
            {!loading && cars.length > 0 && (<Button
                title={t("common.viewMore")}
                buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 10, margin: 10 }}
                disabled={!meta?.has_next_page}
                onPress={() => setSearchParams({ ...searchParams, size: searchParams?.size ?? 0 + 10 })}
            />)}

            <FilterPopup isVisible={filterVisible} toggleDialog={() => setFilterVisible(!filterVisible)} searchParams={searchParams} setSearchParams={setSearchParams} />
        </LayoutMain>
    );
};

export default CarScreen;