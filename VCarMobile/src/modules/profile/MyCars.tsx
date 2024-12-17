import { View, Text, FlatList } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Divider, Switch } from 'react-native-elements';
import { Button, Flex, Modal, Toast } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import { Searchbar } from 'react-native-paper';
import { deleteCar, getMyCars } from '../../store/car/handlers';
import { IMetaData } from '../../store/rental/types';
import { ICar } from '../../store/car/types';
import { debounce } from 'lodash';
import CarCard from '../car/CarCard';
import CardSkeleton from '../../components/common/CardSkeleton';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const MyCars = () => {
    const route = useRoute();
    const { refetchCars } = route.params as { refetchCars?: boolean };
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [cars, setCars] = useState<ICar[]>([]);
    const [meta, setMeta] = useState({} as IMetaData);
    const [sortDescending, setSortDescending] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = React.useState('');
    const [params, setParams] = useState({
        sortDescending: "true",
        page: "0",
        size: "5",
        status: "",
        searchQuery: "",
    });

    const handleSortChange = (value: boolean) => {
        setSortDescending(value);
        setParams(prevParams => ({
            ...prevParams,
            sortDescending: value ? "true" : "false",
            page: "0",
        }));
    };
    const searchKeyWordDebounce = debounce(() => {
        setParams((prevParams) => ({ ...prevParams, searchQuery: search }));
    }, 500);

    useMemo(() => {
        async function fetchData() {
            setLoading(true);
            const response = await getMyCars(params);
            if (response?.success) {
                setCars(response?.data);
                setMeta(response?.meta ?? {} as IMetaData);
            }
            setLoading(false);
        }
        fetchData();
    }, [params, refetchCars]);

    useMemo(() => {
        searchKeyWordDebounce();
        return () => {
            searchKeyWordDebounce.cancel();
        };
    }, [search]);

    const handleDeleteCar = (id: string) => {
        Modal.alert(t('common.delete'), t('profile.my_cars.delete_confirm'), [
            {
                text: t('common.cancel'),
            },
            {
                text: t('common.ok'),
                onPress: async () => {
                    const key = Toast.loading({
                        content: t('common.processing'),
                        duration: 0,
                        mask: true
                    });
                    const response = await deleteCar(id);
                    if (response?.success) {
                        Toast.remove(key);
                        Toast.success(t('common.success'), 1);
                        setParams(prevParams => ({
                            ...prevParams,
                            page: "0",
                        }))
                    } else {
                        Toast.remove(key);
                        Toast.fail(t('common.some_things_wrong'), 1);
                    }
                },
            },
        ])
    }

    const { t } = useTranslation();

    return (
        <View>
            <View className='p-4'>
                <Searchbar
                    placeholder={t('profile.my_cars.search')}
                    value={search}
                    onChangeText={setSearch}
                    className='mb-4'
                    onClearIconPress={() => setSearch('')}
                />
                <Flex align='center' justify='between'>
                    <Flex>
                        <Text style={{ marginRight: 8, color: '#4a4a4a' }}>{t('common.sort_desc')}</Text>
                        <Switch
                            value={sortDescending}
                            onValueChange={handleSortChange}
                        />
                    </Flex>
                    <Button type='primary' onPress={() => navigation.navigate('CREATE_CAR_SCREEN')}>{t('profile.my_cars.add_new_car')}</Button>
                </Flex>
            </View>
            <Divider className='mx-5'></Divider>
            <View className='p-4'>
                {!loading && cars?.length > 0 && (
                    <FlatList
                        data={cars}
                        renderItem={({ item }) => (
                            <CarCard key={item?.id} car={item} isFullWidth isAdmin onDelete={handleDeleteCar} />
                        )}
                        keyExtractor={(item) => item?.id?.toString()}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if (meta.has_next_page) {
                                setParams(prevParams => ({
                                    ...prevParams,
                                    size: (parseInt(prevParams.size) + 4).toString(),
                                }));
                            }
                        }}
                        contentContainerStyle={{ paddingBottom: 300 }} // Add padding to the bottom
                    />
                )}
                {!loading && cars?.length === 0 && (
                    <Text className='text-center'>{t('common.empty')}</Text>
                )}
                {loading && (
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        renderItem={({ item }) => (
                            <CardSkeleton isFullWidth />
                        )}
                        keyExtractor={(item) => item?.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom
                    />
                )}
            </View>
        </View>
    );
};

export default MyCars;