import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { GetProp, message, Upload, UploadProps } from "antd";
import { useState } from "react";
import { getUserInfoFromCookie } from "../../utils";
import { useTranslation } from "react-i18next";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};


const ImageUploader = () => {
    const userInfo = getUserInfoFromCookie()
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(userInfo?.image_url);
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
    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>{t("common.upload")}</div>
        </button>
    );
    return (
        <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : uploadButton}
        </Upload>
    );
};

export default ImageUploader;