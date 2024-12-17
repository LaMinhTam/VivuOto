import { useTranslation } from "react-i18next";
import { IQuerySearchCar } from "../store/car/types";
import { useSearchParams } from "react-router-dom";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { GET_CARS } from "../store/car/action";
import CarCard from "../components/CarCard";
import { Affix, Button, Checkbox, Col, Divider, Empty, Input, InputNumber, Pagination, Rate, Row, Select, Typography } from "antd";
import CarCardSkeleton from "../components/common/CarCardSkeleton";
import FilterLocation from "../components/common/FilterLocation";
import provinces from "../config/provincesMockup";
import { debounce } from "lodash";
import { Helmet } from "react-helmet";

interface ICarListForm {
    minConsumption: number | undefined;
    maxConsumption: number | undefined;
    rating: string;
    maxRate: number | undefined;
}
const ListCarPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const province = searchParams.get("province");
    const transmissionOptions = [
        { label: t("car.automatic"), value: 'AUTO' },
        { label: t("car.manual"), value: 'MANUAL' },
    ];
    const seatsOptions = [
        { label: `2 ${t("common.person")}`, value: "2" },
        { label: `5 ${t("common.person")}`, value: "4" },
        { label: `7 ${t("common.person")}`, value: "7" },
        { label: `9 ${t("common.person")}`, value: "9" },
        { label: `10+ ${t("common.person")}`, value: "10" },
    ];

    const handlePageChange = (page: number, pageSize?: number) => {
        setParams({
            ...params,
            page: page - 1,
            size: pageSize || 10,
        });
    };

    const [params, setParams] = useState<IQuerySearchCar>({
        page: 0,
        size: 10
    });
    const [filterData, setFilterData] = useState<ICarListForm>({
        minConsumption: undefined,
        maxConsumption: undefined,
        rating: "5",
        maxRate: undefined,
    });

    useEffect(() => {
        if (startDate && endDate && province) {
            setParams({ ...params, rentalStartDate: startDate, rentalEndDate: endDate, province })
        } else {
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, province]);
    const { cars, loading, meta } = useSelector((state: RootState) => state.car);
    const initProvinceId = useMemo(() => {
        const province = provinces.find(p => p.enName === searchParams.get("province")?.replace("_", " "));
        return province?.id;
    }, [searchParams])
    const dispatch = useDispatch<AppDispatch>();
    let onChangeCarName = (e: ChangeEvent<HTMLInputElement>) => {
        setParams({ ...params, query: e.target.value });
    }
    onChangeCarName = debounce(onChangeCarName, 600);
    const handleApplyFilters = () => {
        const newParams = { ...params };
        if (filterData.minConsumption) newParams.minConsumption = filterData.minConsumption;
        if (filterData.maxConsumption) newParams.maxConsumption = filterData.maxConsumption;
        if (filterData.rating) newParams.rating = filterData.rating;
        if (filterData.maxRate) newParams.maxRate = filterData.maxRate;
        setParams(newParams);
    }
    useMemo(() => {
        dispatch({ type: GET_CARS, payload: params });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);
    const getLocationText = () => {
        if (province) {
            const provinceName = provinces.find(p => p.enName === province.replace("_", " "))?.vnName;
            return `tại ${provinceName || 'Việt Nam'}`;
        }
        return 'tại Việt Nam';
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        "name": "VivuOto - Danh sách xe cho thuê",
        "description": `Danh sách xe ô tô cho thuê ${getLocationText()}. Đa dạng các loại xe, giá cả hợp lý, thủ tục đơn giản.`,
        "url": "https://vivuoto-rental.vercel.app/cars",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": cars.map((car, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": car.name,
                    "brand": car.brand,
                    "description": car.description
                }
            }))
        }
    };
    return (
        <>
            <Helmet>
                <title>{`Thuê xe ô tô ${getLocationText()} | VivuOto`}</title>
                <meta
                    name="description"
                    content={`Thuê xe ô tô ${getLocationText()} với đa dạng các loại xe ${params.transmission ?
                        `hộp số ${params.transmission === 'AUTO' ? 'tự động' : 'số sàn'}` :
                        ''
                        }. Giá thuê từ ${params?.maxRate?.toLocaleString()}đ/ngày. Đặt xe ngay!`}
                />
                <meta
                    name="keywords"
                    content={`thuê xe ô tô, thuê xe tự lái, thuê xe có tài xế, thuê xe ${getLocationText()}, thuê xe giá rẻ`}
                />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://vivuoto-rental.vercel.app/cars" />
                <meta property="og:title" content={`Thuê xe ô tô ${getLocationText()} | VivuOto`} />
                <meta
                    property="og:description"
                    content={`Thuê xe ô tô ${getLocationText()} với đa dạng các loại xe. Đặt xe ngay hôm nay!`}
                />
                <meta property="og:image" content="https://vivuoto-rental.vercel.app/cars-banner.jpg" />

                {/* Additional Meta Tags */}
                <meta name="robots" content="index, follow" />
                <meta name="language" content="Vietnamese" />
                <meta name="revisit-after" content="1 days" />
                <meta name="author" content="VivuOto" />

                {/* Canonical URL */}
                <link rel="canonical" href={`https://vivuoto-rental.vercel.app/cars${window.location.search}`} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <div className="flex bg-[#f8f4fc] min-h-screen">
                <div className="w-72 p-4 bg-white shadow-md fixed top-[64px] left-0 h-[calc(100%-64px)] overflow-y-auto">
                    <Row gutter={[12, 24]}>
                        <Col span={24}>
                            <Typography.Title level={3}>{t("car.name")}</Typography.Title>
                            <Input placeholder={t("car.name")} onChange={onChangeCarName} />
                        </Col>
                        <Divider className="m-0"></Divider>
                        <Col span={24}>
                            <Typography.Title level={4}>{t("car.transmission")}</Typography.Title>
                            <Checkbox.Group options={transmissionOptions} onChange={(value) => {
                                setParams({ ...params, transmission: value.join(',') });
                            }} />
                        </Col>
                        <Divider className="m-0"></Divider>
                        <Col span={24}>
                            <Typography.Title level={4}>{t("car.seat")}</Typography.Title>
                            <Select
                                mode="multiple"
                                className="w-full"
                                options={seatsOptions}
                                placeholder={t("car.seat")}
                                onChange={(value) => {
                                    setParams({ ...params, seats: value.join(',') });
                                }}
                                allowClear
                            />
                        </Col>
                        <Divider className="m-0"></Divider>
                        <Col span={24}>
                            <Row gutter={[8, 8]}>
                                <Col span={24}>
                                    <Typography.Title level={4}>{t("car.fuel_consumption")}</Typography.Title>
                                </Col>
                                <Col span={10}>
                                    <InputNumber
                                        placeholder={t("common.from")}
                                        className="w-full"
                                        value={filterData.minConsumption}
                                        onChange={(value) => setFilterData({ ...filterData, minConsumption: value as number })}
                                    />
                                </Col>
                                <Col span={2} className="flex items-center justify-center">
                                    <span className="text-center">-</span>
                                </Col>
                                <Col span={10}>
                                    <InputNumber
                                        placeholder={t("common.to")}
                                        className="w-full"
                                        value={filterData.maxConsumption}
                                        onChange={(value) => setFilterData({ ...filterData, maxConsumption: value as number })}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Typography.Title level={4}>{t("car.maxRate")}</Typography.Title>
                                    <InputNumber
                                        min={0}
                                        placeholder={t("car.maxRate")}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        className="w-full"
                                        value={filterData.maxRate}
                                        onChange={(value) => setFilterData({ ...filterData, maxRate: value as number })}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Typography.Title level={4}>{t("car.rating")}</Typography.Title>
                                    <Rate
                                        value={Number(filterData.rating)}
                                        onChange={(value) => setFilterData({ ...filterData, rating: value.toString() })}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Button
                                        block
                                        type="primary"
                                        className="mt-5"
                                        onClick={handleApplyFilters}
                                    >
                                        {t("common.applyFilters")}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="flex-1 ml-64">
                    <Affix offsetTop={16} className="mb-5 shadow-md bg-lite">
                        <FilterLocation
                            initStartDate={Number(searchParams.get("startDate"))}
                            initEndDate={Number(searchParams.get("endDate"))}
                            initProvinceId={initProvinceId ?? 1}
                        ></FilterLocation>
                    </Affix>
                    <div className="p-4">
                        {loading && <Row gutter={[32, 32]}>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Col key={index} span={8}>
                                    <CarCardSkeleton />
                                </Col>
                            ))}
                        </Row>}
                        {!loading && (
                            <>
                                {cars.length > 0 ? (
                                    <>
                                        <Row gutter={[32, 32]}>
                                            {cars.map((car) => (
                                                <Col key={car.id} span={8}>
                                                    <CarCard car={car} />
                                                </Col>
                                            ))}
                                        </Row>
                                        <Row justify="end" className="mt-4">
                                            <Pagination
                                                current={meta.page + 1}
                                                pageSize={meta.page_size}
                                                total={meta.item_count}
                                                onChange={handlePageChange}
                                                showSizeChanger
                                                onShowSizeChange={() => {
                                                    handlePageChange(1, Number(searchParams.get("size") ?? 10));
                                                }}
                                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                            />
                                        </Row>
                                    </>
                                ) : (
                                    <Empty />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>

    );
};


export default ListCarPage;