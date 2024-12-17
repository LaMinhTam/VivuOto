import { CarOutlined, DeleteOutlined, EditOutlined, HeartOutlined, LeftOutlined } from "@ant-design/icons";
import gasStationIcon from "../assets/gas-station.png";
import transmissionIcon from "../assets/transmission.png";
import { Button, Carousel, Col, Divider, Flex, message, Modal, Rate, Row, Spin, Tag, Typography } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useMemo, useState } from "react";
import { GET_CAR_BY_ID } from "../store/car/action";
import { deleteCar } from "../store/car/handlers";
import EditCarModal from "../components/modals/EditCarModal";
import { ICreateCarData } from "../store/car/types";

const MyCarDetails = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [carData, setCarData] = useState({} as ICreateCarData);
    const [refetchCarData, setRefetchCarData] = useState(false);
    const [onEditModal, setOpenEditModal] = useState(false);
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const { car, reviews } = carDetail;
    useMemo(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: id });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, id, refetchCarData])
    useEffect(() => {
        if (car) {
            // setCarData({
            //     image_url: car?.image_url ?? [],
            //     province: car?.province ?? '',
            //     location: car?.location ?? '',

            //     //thông tin xe
            //     name: car?.name ?? "",
            //     seat: car?.seat ?? 0,
            //     color: car?.color ?? "",
            //     brand: "BMW",
            //     manufacturing_year: 2019,
            //     transmission: car?.transmission ?? "",
            //     fuel: car?.fuel ?? "",
            //     fuel_consumption: car?.fuel_consumption ?? 0,
            //     description: car?.description ?? "",
            //     features: car?.features ?? [],

            //     //thông tin đăng ký xe
            //     license_plate: car?.license_plate ?? '', //biển số xe
            //     registration_number: car?.registration_number ?? 0, //Giấy đăng ký xe ô tô số
            //     registration_date: new Date(), // ngày đăng ký
            //     registration_location: car?.registration_location ?? '', // tại

            //     // Thông tin thuê
            //     daily_rate: car?.daily_rate ?? 0,
            //     mileage_limit_per_day: car?.mileage_limit_per_day ?? 0,
            //     extra_mileage_charge: car?.extra_mileage_charge ?? 0,
            //     extra_hourly_charge: car?.extra_hourly_charge ?? 0,
            //     washing_price: 1,
            //     deodorise_price: 1
            // })
            setCarData(car);
        }
    }, [car])
    const handleDeleteCar = () => {
        Modal.confirm({
            title: t("account.my_cars.delete_confirm"),
            content: t("account.my_cars.delete_desc"),
            async onOk() {
                setDeleteLoading(true);
                const response = await deleteCar(id as string);
                if (response.success) {
                    setDeleteLoading(false);
                    message.success(t("msg.DELETE_CAR_SUCCESS"));
                    navigate('/account/my-cars');
                } else {
                    setDeleteLoading(false);
                    message.error(t("msg.DELETE_CAR_FAILED"));
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    return (
        <Spin spinning={loading || deleteLoading}>
            <div className="p-4 shadow-md bg-lite">
                <Flex align="center" justify="space-between">
                    <Link to={'/account/my-cars'}>
                        <LeftOutlined />
                    </Link>
                    <Flex align="center" gap={20}>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => setOpenEditModal(true)}>{t("common.update")}</Button>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteCar}>{t("common.delete")}</Button>
                    </Flex>
                </Flex>
                <Divider></Divider>
                <Row gutter={[32, 12]} justify={"center"} align={"stretch"}>
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
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Title level={5}>{t("common.description")}</Typography.Title>
                        <div dangerouslySetInnerHTML={{ __html: car?.description }}></div>
                    </Col>
                </Row>
            </div>
            <Modal
                title={t("account.my_cars.update")}
                open={onEditModal}
                footer={false}
                onCancel={() => setOpenEditModal(false)}
                width={1000}
                maskClosable={false}
                destroyOnClose={true}
            >
                <EditCarModal id={car?.id} carData={carData} setOpen={setOpenEditModal} refetchCarData={refetchCarData} setRefetchCarData={setRefetchCarData}></EditCarModal>
            </Modal>
        </Spin>
    );
};

export default MyCarDetails;