import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { GET_CAR_BY_ID } from '../store/car/action';
import { v4 as uuidv4 } from 'uuid';
import { Avatar, Button, Carousel, Col, Divider, Flex, Rate, Row, Spin, Tag, Typography } from 'antd';
import { CarOutlined, HeartOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import gasStationIcon from "../assets/gas-station.png";
import transmissionIcon from "../assets/transmission.png";
import { useTranslation } from 'react-i18next';
import CarCard from '../components/CarCard';
import CarCardSkeleton from '../components/common/CarCardSkeleton';
import { convertTimestampToDayjs, handleGenerateViewAllCarsLink } from '../utils/helper';
import { useAuth } from '../contexts/auth-context';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const CarDetailPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const { isLogged } = useAuth()
    useMemo(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: id });
    }, [dispatch, id])
    const handleRentNow = (id: string) => {
        if (isLogged) {
            localStorage.setItem("STORAGE_RENT_CAR_ID", id);
            navigate("/checkout");
        } else {
            toast.warning(t("msg.REQUIRE_AUTHENTICATION_FEATURE"))
        }
    }
    if (!id || !carDetail?.car || !carDetail?.related_cars || !carDetail?.reviews) return null;
    const { car, related_cars, reviews } = carDetail;
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Car",
        "name": car?.name,
        "description": car?.description?.replace(/<[^>]*>?/gm, ''),
        "brand": car?.brand,
        "manufacturer": car?.brand,
        "model": car?.name,
        "vehicleTransmission": car?.transmission,
        "numberOfDoors": car?.seat,
        "fuelConsumption": `${car?.fuel_consumption}L/100km`,
        "offers": {
            "@type": "Offer",
            "price": car?.daily_rate,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
        }
    };
    return (
        <div>
            {!loading && car?.id && <>
                <Helmet>
                    <title>{`${car?.name} - ${car?.brand} | Thuê xe tự lái VivuOto`}</title>
                    <meta
                        name="description"
                        content={`Thuê xe ${car?.name} ${car?.brand} với hộp số ${car?.transmission === "MANUAL" ? "số sàn" : "tự động"}, ${car?.seat} chỗ ngồi, mức tiêu thụ nhiên liệu ${car?.fuel_consumption}L/100km. Đặt xe ngay hôm nay!`}
                    />
                    <meta
                        name="keywords"
                        content={`thuê xe ${car?.name}, thuê xe ${car?.brand}, thuê xe ô tô, thuê xe tự lái, thuê xe có tài xế`}
                    />

                    {/* Open Graph / Facebook */}
                    <meta property="og:locale" content="vi_VN" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`https://vivuoto-rental.vercel.app/cars/${car?.id}`} />
                    <meta property="og:title" content={`${car?.name} - ${car?.brand} | Thuê xe tự lái VivuOto`} />
                    <meta
                        property="og:description"
                        content={`Thuê xe ${car?.name} ${car?.brand} với hộp số ${car?.transmission === "MANUAL" ? "số sàn" : "tự động"}, ${car?.seat} chỗ ngồi, mức tiêu thụ nhiên liệu ${car?.fuel_consumption}L/100km. Đặt xe ngay hôm nay!`}
                    />
                    <meta property="og:image" content={car?.image_url[0]} />

                    {/* Additional Meta Tags */}
                    <meta name="robots" content="index, follow" />
                    <meta name="language" content="Vietnamese" />
                    <meta name="revisit-after" content="1 days" />
                    <meta name="author" content="VivuOto" />

                    {/* Structured Data */}
                    <script type="application/ld+json">
                        {JSON.stringify(structuredData)}
                    </script>
                </Helmet>
                <Row gutter={[32, 0]} justify={"center"} align={"stretch"}>
                    <Col span={12}>
                        <Carousel draggable autoplay autoplaySpeed={5000} arrows className='w-full h-[448px] rounded-lg'>
                            {car && car.image_url.map((image) => (
                                <div key={uuidv4()} className='w-full h-[448px] rounded-lg'>
                                    <img src={image} alt={car.name} className="object-cover w-full h-full rounded-lg" />
                                </div>
                            ))}
                        </Carousel>
                    </Col>
                    <Col span={12}>
                        <div className='p-4 rounded-lg shadow-md bg-lite'>
                            <div className='flex items-start justify-between mb-2'>
                                <div>
                                    <Typography.Title level={3}>{car?.name}</Typography.Title>
                                    <div className='flex items-center justify-start gap-x-2'>
                                        <Rate allowHalf disabled defaultValue={car?.average_rating} />
                                        <Typography.Text>{reviews?.length ?? 0}+ {t("common.reviewer")}</Typography.Text>
                                    </div>
                                </div>
                                <HeartOutlined className='text-2xl cursor-pointer' />
                            </div>
                            <div>
                                <Typography.Title level={5}>{t("common.characteristic")}</Typography.Title>
                                <div className="flex items-center justify-start mb-2 gap-x-5">
                                    <div className="flex items-center">
                                        <img
                                            src={gasStationIcon}
                                            alt={t("car.fuel_consumption")}
                                            className="w-6 h-6 mr-2"
                                        />
                                        <div className='flex flex-col'>
                                            <Typography.Text className="text-filter-range">
                                                {t("car.fuel_consumption")}
                                            </Typography.Text>
                                            <Typography.Text className="text-filter-range">
                                                {car?.fuel_consumption} {t("common.litersPer100km")}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            src={transmissionIcon}
                                            alt={t("car.transmission")}
                                            className="w-6 h-6 mr-2"
                                        />
                                        <div className='flex flex-col'>
                                            <Typography.Text className="text-filter-range">
                                                {t("car.transmission")}
                                            </Typography.Text>
                                            <Typography.Text className="text-filter-range">
                                                {car?.transmission === "MANUAL" ? t("car.manual") : t("car.automatic")}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <CarOutlined className='mr-2 text-2xl' />
                                        <div className='flex flex-col'>
                                            <Typography.Text className="text-filter-range">
                                                {t("car.seat")}
                                            </Typography.Text>
                                            <Typography.Text className="text-filter-range">
                                                {car?.seat}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Typography.Title level={5}>{t("car.features")}</Typography.Title>
                                <div className="flex flex-wrap gap-2">
                                    {car?.features.map((feature, index) => (
                                        <Tag key={index} color="blue">
                                            {t(`car.feature.${feature.toLowerCase()}`)}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <span className="font-bold text-primary-default">
                                    {car?.daily_rate?.toLocaleString()} {t("common.currency")} /{" "}
                                    <span className="text-filter-range">{t("common.day")}</span>
                                </span>
                                <Button type="primary" onClick={() => handleRentNow(car?.id ?? id)}>{t("common.rentNow")}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className='mt-10 rounded shadow-sm bg-lite'>
                    <Typography.Title level={3} style={{ textTransform: 'uppercase', padding: '4px 16px' }}>{t("common.carInformation")}</Typography.Title>
                    <Divider className='m-0'></Divider>
                    <div dangerouslySetInnerHTML={{ __html: car?.description }} className='p-4'></div>
                </div>
                <div className='w-full h-full p-4 mt-8 rounded-lg shadow-md'>
                    <Typography.Title level={4}>{t("common.carOwner")}</Typography.Title>
                    <Divider></Divider>
                    <div className='flex items-start gap-x-2'>
                        <Avatar size={"large"} src={car?.owner?.image_url} icon={<UserOutlined style={{ color: '#4754a4' }} />} className='cursor-pointer' alt='Avatar'></Avatar>
                        <div>
                            <Typography.Title level={5} className='cursor-pointer'>{car?.owner?.display_name}</Typography.Title>
                            <div className='flex flex-col gap-y-2'>
                                <Typography.Text><PhoneOutlined className='mr-2 text-xl' />{car?.owner?.phone_number}</Typography.Text>
                                <Typography.Text><MailOutlined className='mr-2 text-xl' />{car?.owner?.email}</Typography.Text>
                            </div>
                        </div>
                        {/* <Button type='primary' className='ml-auto'>Nhắn tin</Button> */}
                    </div>
                </div>
                <div className='w-full h-full p-4 mt-8 rounded-lg shadow-md'>
                    <div className='flex items-center justify-start mb-8 gap-x-2'>
                        <Typography.Title level={4} style={{
                            margin: 0
                        }}>{t("car.rating")}</Typography.Title>
                        <Tag color='blue-inverse'>{reviews?.length ?? 0}</Tag>
                    </div>
                    <Divider></Divider>
                    <Flex vertical>
                        {reviews && reviews.map((review) => (
                            <Row key={review.id}>
                                <Col span={20}>
                                    <div className='flex items-start gap-x-2'>
                                        <Avatar size={"large"} src={review?.lessee?.image_url} icon={<UserOutlined style={{ color: '#4754a4' }} />} alt='Avatar'></Avatar>
                                        <div className='flex-1'>
                                            <Typography.Title level={5}>{review?.lessee?.display_name}</Typography.Title>
                                            {review?.comment && <Typography.Paragraph>{review?.comment}</Typography.Paragraph>}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div className='flex flex-col items-end justify-end gap-y-2'>
                                        <Typography.Text>{convertTimestampToDayjs(review?.create_at)?.format("DD/MM/YYYY")}</Typography.Text>
                                        <Rate disabled defaultValue={review?.rating} allowHalf></Rate>
                                    </div>
                                </Col>
                                <Divider></Divider>
                            </Row>
                        ))}
                    </Flex>
                </div>
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-5">
                        <Typography.Text className="text-text7">{t("common.relatedCar")}</Typography.Text>
                        <Button type="link" href={handleGenerateViewAllCarsLink()}>{t("common.viewAll")}</Button>
                    </div>
                    <Row gutter={[32, 32]}>
                        {related_cars.length > 0 && related_cars?.slice(0, 4).map((car) => (
                            <Col key={car.id} span={6}>
                                <CarCard car={car} />
                            </Col>
                        ))}
                        {loading && Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} span={6}>
                                <CarCardSkeleton></CarCardSkeleton>
                            </Col>
                        ))}
                    </Row>
                </div>
            </>}
            {loading && !car?.id && <div className='flex items-center justify-center'><Spin size="large" spinning={loading}></Spin></div>}
        </div >
    );
};

export default CarDetailPage;