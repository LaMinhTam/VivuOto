import { EditOutlined, SlidersOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Flex, Modal, Row, Typography } from 'antd';
import { getUserInfoFromCookie } from '../../../utils';
import UpdateProfileModal from '../../../components/modals/UpdateProfileModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertTimestampToDayjs } from '../../../utils/helper';

const ProfileCard = ({
    refetchMe,
    setRefetchMe
}: {
    refetchMe: boolean;
    setRefetchMe: (value: boolean) => void;
}) => {
    const { t } = useTranslation()
    const userInfo = getUserInfoFromCookie();
    const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
    return (
        <>
            <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Flex align="center" justify="space-between">
                            <Flex gap={4}>
                                <Typography.Title level={3}>{t("account.my_account.information")}</Typography.Title>
                                <Button icon={<EditOutlined />} type="text" onClick={() => setOpenUpdateProfileModal(true)}></Button>
                            </Flex>
                            <Flex align="center" gap={4} className="inline-flex px-4 py-2 border rounded-lg border-text3">
                                <SlidersOutlined className="text-lg" />
                                <Typography.Text className="text-3xl font-bold text-primary">0</Typography.Text>
                                <Typography.Text className="text-text3">{t("account.my_account.trip")}</Typography.Text>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col span={6}>
                        <Flex gap={12} vertical align="center">
                            {/* <ImageUploader></ImageUploader> */}
                            <Avatar
                                src={userInfo?.image_url}
                                alt={userInfo?.display_name}
                                icon={<UserOutlined style={{ color: '#4754a4' }} />}
                                size={128}
                            />
                            <Typography.Title level={5}>{userInfo?.display_name}</Typography.Title>
                            <Typography.Text>{t("account.my_account.join")}: 05/09/2024</Typography.Text>
                        </Flex>
                    </Col>
                    <Col span={18}>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Flex align="center" justify="space-between">
                                    <Typography.Text>{t("account.my_account.birthday")}</Typography.Text>
                                    <Typography.Text>{convertTimestampToDayjs(Number(userInfo?.car_license?.dob))?.format("DD/MM/YYYY")}</Typography.Text>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Flex align="center" justify="space-between">
                                    <Typography.Text>{t("account.my_account.sex")}</Typography.Text>
                                    <Typography.Text>{"Nam"}</Typography.Text>
                                </Flex>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Flex align="center" justify="space-between">
                                    <Typography.Text>{t("account.my_account.email")}</Typography.Text>
                                    <Typography.Text>{userInfo?.email}</Typography.Text>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Flex align="center" justify="space-between">
                                    <Typography.Text>{t("account.my_account.phoneNumber")}</Typography.Text>
                                    <Typography.Text>{userInfo?.phone_number}</Typography.Text>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Modal title={t("account.my_account.update_profile")} footer={false} open={openUpdateProfileModal} onCancel={() => setOpenUpdateProfileModal(false)} maskClosable={false} destroyOnClose={true}>
                <UpdateProfileModal refetchMe={refetchMe} setRefetchMe={setRefetchMe} setOpenUpdateProfileModal={setOpenUpdateProfileModal}></UpdateProfileModal>
            </Modal>
        </>
    );
};

export default ProfileCard;