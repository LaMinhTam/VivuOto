import { Avatar, Button, Col, Divider, Row, Tag, Typography } from "antd";
import { IRentalData, IRentalRequestParams } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays } from "../../utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { IUser } from "../../store/auth/types";
import { axiosPrivate } from "../../apis/axios";
import { approveRentRequest, rejectRentRequest } from "../../store/rental/handlers";
import { toast } from "react-toastify";

const LesseeDetailDialog = ({ record, setIsModalOpen, params, setParams }: {
    record: IRentalData;
    setIsModalOpen: (isOpen: boolean) => void;
    params: IRentalRequestParams;
    setParams: (params: IRentalRequestParams) => void;
}) => {
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const [user, setUser] = useState<IUser>();
    const { carDetail } = useSelector((state: RootState) => state.car);
    const { car } = carDetail;
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id])

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axiosPrivate.get(`/users/${record?.lessee_id}`);
                if (response.data.code === 200) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, [record?.lessee_id])

    const handleApproveRentRequest = async () => {
        setApproveLoading(true);
        const response = await approveRentRequest(record.id);
        if (response?.success) {
            setApproveLoading(false);
            setIsModalOpen(false);
            setParams({
                ...params,
            });
            toast.success('Đã duyệt yêu cầu thuê xe!');
        } else {
            toast.error('Duyệt yêu cầu thuê xe thất bại!');
            setApproveLoading(false);
        }
    }

    const handleRejectRentRequest = async () => {
        setRejectLoading(true);
        const response = await rejectRentRequest(record.id);
        if (response?.success) {
            setRejectLoading(false);
            setIsModalOpen(false);
            setParams({
                ...params,
            });
            toast.success('Đã từ chối yêu cầu thuê xe!');
        } else {
            toast.error('Từ chối yêu cầu thuê xe thất bại!');
            setRejectLoading(false);
        }
    }

    if (!record) return null;
    return (
        <Row gutter={[12, 0]} justify={"start"}>
            <Col span={12}>
                <div className='w-full h-full p-4 rounded-lg shadow-md'>
                    <Typography.Title level={4}>Người thuê xe</Typography.Title>
                    <Divider></Divider>
                    <div className='flex items-start gap-x-2'>
                        <Avatar size={"large"} src={DEFAULT_AVATAR} className='cursor-pointer' alt='Avatar'></Avatar>
                        <div>
                            <Typography.Title level={5} className='cursor-pointer'>{user?.display_name}</Typography.Title>
                            <div className='flex flex-col gap-y-2'>
                                <Typography.Text><PhoneOutlined className='mr-2 text-xl' />{user?.phone_number}</Typography.Text>
                                <Typography.Text><MailOutlined className='mr-2 text-xl' />{user?.email}</Typography.Text>
                            </div>
                        </div>
                        <Button type='primary' className='ml-auto'>Nhắn tin</Button>
                    </div>
                    <Divider className="my-5"></Divider>
                    <Row gutter={[0, 12]}>
                        <Col span={24}>
                            <Typography.Title level={5}>Ngày bắt đầu thuê:</Typography.Title>
                            <Typography.Text>{new Date(record?.rental_start_date).toLocaleString()}</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <Typography.Title level={5}>Ngày kết thúc thuê:</Typography.Title>
                            <Typography.Text>{new Date(record?.rental_end_date).toLocaleString()}</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <Typography.Title level={5}>Địa điểm lấy xe:</Typography.Title>
                            <Typography.Text>{record?.vehicle_hand_over_location}</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <Typography.Title level={5}>Trạng thái: <Tag color={
                                record.status === 'APPROVED' ? 'green' :
                                    record.status === 'PENDING' ? 'orange' :
                                        record.status === 'REJECTED' ? 'red' : 'blue'
                            }>{record.status}</Tag></Typography.Title>
                        </Col>
                        <Divider className="m-0"></Divider>
                        {record.status === 'PENDING' && <Col span={24}>
                            <div className="flex items-center justify-end gap-x-3">
                                <Button type="primary" onClick={handleApproveRentRequest} loading={approveLoading} disabled={rejectLoading}>APPROVE</Button>
                                <Button type="primary" danger onClick={handleRejectRentRequest} loading={rejectLoading} disabled={approveLoading}>REJECT</Button>
                            </div>
                        </Col>}
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
    );
};

export default LesseeDetailDialog;