import { Avatar, Button, Flex, Form, GetProp, Input, message, Spin, Upload, UploadProps } from "antd";
import { updateProfile } from "../../store/profile/handlers";
import { convertDateToTimestamp, getAccessToken, getUserInfoFromCookie, handleUploadFile, saveUserInfoToCookie } from "../../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

interface FieldType {
    display_name: string;
    phone_number: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const UpdateProfileModal = ({ setOpenUpdateProfileModal, refetchMe, setRefetchMe }: {
    setOpenUpdateProfileModal: (value: boolean) => void;
    refetchMe: boolean;
    setRefetchMe: (value: boolean) => void;
}) => {
    const userInfo = getUserInfoFromCookie()
    const { t } = useTranslation()
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error(t("msg.NOT_IMAGE"));
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(t("msg.LIMIT_IMAGE_SIZE"));
        }
        return isJpgOrPng && isLt2M;
    };
    const [avatar, setAvatar] = useState({
        imageData: '',
        imageUrl: userInfo?.image_url || '',
    })
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const accessToken = getAccessToken();
    const handleUploadAvatar = async () => {
        const formData = new FormData();
        formData.append("file", avatar.imageData);
        formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
        );
        formData.append("public_id", `user_avatar_${convertDateToTimestamp(new Date().toDateString())}`);
        const imageUrl = await handleUploadFile(formData, dispatch);
        if (imageUrl) {
            return imageUrl;
        }
    }

    const onFinish = async (values: FieldType) => {
        setLoading(true);
        let imageUrl = avatar.imageUrl;
        if (avatar?.imageData) {
            imageUrl = await handleUploadAvatar();
        }
        const response = await updateProfile({
            ...values,
            image_url: imageUrl
        });
        if (response?.success && response?.data) {
            saveUserInfoToCookie(response?.data, accessToken || '');
            message.success(t("msg.UPDATE_PROFILE_SUCCESS"));
            setOpenUpdateProfileModal(false);
            setLoading(false);
            setRefetchMe(!refetchMe);
        } else {
            message.error(t("msg.UPDATE_PROFILE_FAILED"));
            setLoading(false);
        }
    };
    const handleChangeAvatar = (info: any) => {
        getBase64(info.file.originFileObj as FileType, (imageUrl: string) => {
            setAvatar({
                ...avatar,
                imageData: info.file.originFileObj,
                imageUrl: imageUrl,
            });
        });
    };

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    display_name: userInfo?.display_name || '',
                    phone_number: userInfo?.phone_number || ''
                }}
            >
                <Flex align="center" justify="center" gap={10} vertical>
                    <Avatar
                        src={avatar.imageUrl}
                        size={144}
                        icon={<UserOutlined style={{ color: '#4754a4' }} />}
                    />
                    <Upload
                        showUploadList={false}
                        multiple={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeAvatar}
                    >
                        <Button icon={<UploadOutlined />}>
                            {t("common.upload")}
                        </Button>
                    </Upload>
                </Flex>
                <Form.Item<FieldType>
                    label={t("account.my_account.display_name")}
                    name="display_name"
                    rules={[
                        { required: true, message: t("account.my_account.display_name.required") }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label={t("account.my_account.phoneNumber")}
                    name="phone_number"
                    rules={[
                        { required: true, message: t("account.my_account.phoneNumber.required") },
                        { pattern: /^[0-9]{10}$/, message: t("account.my_account.phoneNumber.invalid") }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" loading={loading}>{t("common.update")}</Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default UpdateProfileModal;