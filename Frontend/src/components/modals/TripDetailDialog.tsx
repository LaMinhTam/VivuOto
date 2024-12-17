import { Avatar, Col, Divider, Empty, Row, Spin, Tag, Typography } from "antd";
import { IRentalData } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays } from "../../utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

const TripDetailDialog = ({ record }: {
    record: IRentalData;
}) => {
    const { t } = useTranslation();
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id])
    if (!record || isEmpty((carDetail?.car))) return <Empty />;
    const { car } = carDetail;
    return (
        <Spin spinning={loading}>
            <Row gutter={[12, 0]} justify={"start"}>
                <Col span={12}>
                    <div className='w-full h-full p-4 rounded-lg shadow-md'>
                        <Typography.Title level={4}>{t("common.carOwner")}</Typography.Title>
                        <Divider></Divider>
                        <div className='flex items-start gap-x-2'>
                            <Avatar size={"large"} src={car?.owner?.image_url} className='cursor-pointer' alt='Avatar'></Avatar>
                            <div>
                                <Typography.Title level={5} className='cursor-pointer'>{car?.owner?.display_name}</Typography.Title>
                                <div className='flex flex-col gap-y-2'>
                                    <Typography.Text><PhoneOutlined className='mr-2 text-xl' />{car?.owner?.phone_number}</Typography.Text>
                                    <Typography.Text><MailOutlined className='mr-2 text-xl' />{car?.owner?.email}</Typography.Text>
                                </div>
                            </div>
                            {/* <Button type='primary' className='ml-auto'>Nhắn tin</Button> */}
                        </div>
                        <Divider></Divider>
                        <Row gutter={[0, 12]}>
                            <Col span={24}>
                                <Typography.Title level={5}>{t("account.my_trips.rental_start_date")}:</Typography.Title>
                                <Typography.Text>{new Date(record?.rental_start_date).toLocaleString()}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>{t("account.my_trips.rental_end_date")}:</Typography.Title>
                                <Typography.Text>{new Date(record?.rental_end_date).toLocaleString()}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>{t("account.my_trips.pick_up_location")}:</Typography.Title>
                                <Typography.Text>{record?.vehicle_hand_over_location}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>{t("account.my_trips.status")}: <Tag color={
                                    record.status === 'APPROVED' ? 'green' :
                                        record.status === 'PENDING' ? 'orange' :
                                            record.status === 'REJECTED' ? 'red' : 'blue'
                                }>{t(`common.${record.status}`)}</Tag></Typography.Title>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={12}>
                    <RentalSummary
                        car={car}
                        totalDays={numberOfDays}
                    ></RentalSummary>
                </Col>
            </Row>
        </Spin>
    );
};

export default TripDetailDialog;