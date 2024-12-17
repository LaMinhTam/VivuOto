import { useState, useEffect, useRef } from 'react';
import { Avatar, Button, Col, Divider, Row, Tag, Typography, Modal, message, Spin, Empty } from "antd";
import { IRentalData, IRentalRequestParams } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays, getUserInfoFromCookie, handleMetaMaskSignature, handleUploadSignature } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { IUser } from "../../store/auth/types";
import { axiosPrivate } from "../../apis/axios";
import { approveRentRequest, rejectRentRequest } from "../../store/rental/handlers";
import { toast } from "react-toastify";
import SignatureCanvas from 'react-signature-canvas';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

const LesseeDetailDialog = ({ record, setIsModalOpen, params, setParams }: {
    record: IRentalData;
    setIsModalOpen: (isOpen: boolean) => void;
    params: IRentalRequestParams;
    setParams: (params: IRentalRequestParams) => void;
}) => {
    const { t } = useTranslation()
    const userInfo = getUserInfoFromCookie();
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const [user, setUser] = useState<IUser>();
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [isSignaturePadVisible, setIsSignaturePadVisible] = useState(false);
    const sigCanvas = useRef<SignatureCanvas>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id]);

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
    }, [record?.lessee_id]);

    const handleApproveRentRequest = async () => {
        setApproveLoading(true);
        // You can send the signature to your backend if needed
        const signatureResult = await handleMetaMaskSignature(userInfo.id);
        if (!signatureResult) {
            message.error(t("msg.METAMASK_SIGNATURE_FAILED"));
            setApproveLoading(false);
            return;
        }
        const { account, signature, msg } = signatureResult;
        if (sigCanvas?.current) {
            const imageUrl = await handleUploadSignature(sigCanvas, dispatch, record?.id, userInfo.id, setApproveLoading);
            if (imageUrl) {

                const response = await approveRentRequest(record.id, {
                    address: account,
                    signature,
                    message: msg,
                    signature_url: imageUrl,
                });
                if (response?.success) {
                    setApproveLoading(false);
                    setIsModalOpen(false);
                    setParams({
                        ...params,
                    });
                    toast.success(t("msg.REQUEST_APPROVED"));
                } else {
                    toast.error(t("msg.APPROVE_REQUEST_FAILED"));
                    setApproveLoading(false);
                }
            } else {
                message.error(t("msg.UPLOAD_SIGNATURE_FAILED"));
                setApproveLoading(false);
                return;
            }
        }
    };

    const handleRejectRentRequest = async () => {
        setRejectLoading(true);
        const response = await rejectRentRequest(record.id);
        if (response?.success) {
            setRejectLoading(false);
            setIsModalOpen(false);
            setParams({
                ...params,
            });
            toast.success(t("msg.REQUEST_REJECTED"));
        } else {
            toast.error(t("msg.REJECT_REQUEST_FAILED"));
            setRejectLoading(false);
        }
    };

    if (!record || isEmpty(carDetail?.car)) return <Empty />;
    const { car } = carDetail;
    return (
        <div>
            <Spin spinning={approveLoading || rejectLoading || loading}>
                <Row gutter={[12, 0]} justify={"start"}>
                    <Col span={12}>
                        <div className='w-full h-full p-4 rounded-lg shadow-md'>
                            <Typography.Title level={4}>{t("account.my_lessee")}</Typography.Title>
                            <Divider></Divider>
                            <div className='flex items-start gap-x-2'>
                                <Avatar size={"large"} src={user?.image_url} className='cursor-pointer' alt='Avatar'></Avatar>
                                <div>
                                    <Typography.Title level={5} className='cursor-pointer'>{user?.display_name}</Typography.Title>
                                    <div className='flex flex-col gap-y-2'>
                                        <Typography.Text><PhoneOutlined className='mr-2 text-xl' />{user?.phone_number}</Typography.Text>
                                        <Typography.Text><MailOutlined className='mr-2 text-xl' />{user?.email}</Typography.Text>
                                    </div>
                                </div>
                            </div>
                            <Divider className="my-5"></Divider>
                            <Row gutter={[0, 12]}>
                                <Col span={24}>
                                    <Typography.Title level={5}>{t("account.my_lessee.rental_start_date")}:</Typography.Title>
                                    <Typography.Text>{new Date(record?.rental_start_date).toLocaleString()}</Typography.Text>
                                </Col>
                                <Col span={24}>
                                    <Typography.Title level={5}>{t("account.my_lessee.rental_end_date")}:</Typography.Title>
                                    <Typography.Text>{new Date(record?.rental_end_date).toLocaleString()}</Typography.Text>
                                </Col>
                                <Col span={24}>
                                    <Typography.Title level={5}>{t("account.my_lessee.pick_up_location")}:</Typography.Title>
                                    <Typography.Text>{record?.vehicle_hand_over_location}</Typography.Text>
                                </Col>
                                <Col span={24}>
                                    <Typography.Title level={5}>{t("account.my_lessee.status")}: <Tag color={
                                        record.status === 'APPROVED' ? 'green' :
                                            record.status === 'PENDING' ? 'orange' :
                                                record.status === 'REJECTED' ? 'red' : 'blue'
                                    }>{t(`common.${record.status}`)}</Tag></Typography.Title>
                                </Col>
                                <Divider className="m-0"></Divider>
                                {record.status === 'PENDING' && <Col span={24}>
                                    <div className="flex items-center justify-end gap-x-3">
                                        <Button type="primary" onClick={() => setIsSignaturePadVisible(true)} loading={approveLoading} disabled={rejectLoading}>{t("common.APPROVE")}</Button>
                                        <Button type="primary" danger onClick={handleRejectRentRequest} loading={rejectLoading} disabled={approveLoading}>{t("common.REJECT")}</Button>
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
                    <Modal
                        title={t("common.signature")}
                        open={isSignaturePadVisible}
                        onOk={() => {
                            sigCanvas.current?.clear();
                            setIsSignaturePadVisible(false);
                            handleApproveRentRequest();
                        }}
                        onCancel={() => setIsSignaturePadVisible(false)}
                        okText={t("common.sign")}
                        cancelText={t("common.cancel")}
                    >
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                        />
                    </Modal>
                </Row>
            </Spin>
        </div>
    );
};

export default LesseeDetailDialog;