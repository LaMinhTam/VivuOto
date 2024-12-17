import { PlusOutlined } from "@ant-design/icons";
import { Col, Form, message, Row, Typography, Upload } from "antd";
import { UploadFile } from "antd/es/upload";
import { useTranslation } from "react-i18next";
import { isAbleUpload, onPreview } from "../../utils";


const CarImageTab = ({ screenShot, setScreenShot }: {
    screenShot: UploadFile[];
    setScreenShot: (screenShot: UploadFile[]) => void;
}) => {
    const { t } = useTranslation();

    const handleChange = (info: {
        fileList: UploadFile[],
        file: UploadFile
    }) => {
        const isImage = isAbleUpload(info.file);
        if (!isImage) return;
        if (info.fileList.length > 10) {
            message.error('Số lượng ảnh tối đa là 10 ảnh');
            return;
        }
        setScreenShot(info.fileList);
    };

    const handleRemove = (file: UploadFile) => {
        const newScreenShot = screenShot.filter(item => item.uid !== file.uid);
        setScreenShot(newScreenShot);
    };


    return (
        <Row>
            <Col span={24}>
                <Form.Item
                    name={"image_url"}
                    label={t('car.image_url')}
                    rules={[{ required: true, message: t('car.image_url.required') }]}
                >
                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        fileList={screenShot}
                        onChange={handleChange}
                        onRemove={handleRemove}
                        // beforeUpload={(file, fileList) => beforeUpload(file, fileList, t)}
                        beforeUpload={() => false}
                        onPreview={onPreview}
                        multiple={true}
                    >
                        {screenShot?.length > 10 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Typography.Text className="text-sm italic font-normal text-text4">Số lượng ảnh tối đa: 10 ảnh</Typography.Text>
            </Col>
        </Row>
    );
};

export default CarImageTab;
