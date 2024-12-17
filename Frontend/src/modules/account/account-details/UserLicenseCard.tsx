import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, Row, Typography, Upload, UploadFile, UploadProps } from "antd";
import { getUserInfoFromCookie } from "../../../utils";
import { useTranslation } from "react-i18next";
import { convertTimestampToDayjs } from "../../../utils/helper";

const UserLicenseCard = ({
    onEdit,
    setOnEdit,
    fileList,
    handleChange,
    handleRemove,
    imageUrl,
    handleUpdateLicense,
    loading
}: {
    onEdit: boolean;
    setOnEdit: (value: boolean) => void;
    fileList: UploadFile[];
    handleChange: UploadProps["onChange"];
    handleRemove: () => void;
    imageUrl: string;
    handleUpdateLicense: () => Promise<void>;
    loading: boolean;
}) => {
    const { t } = useTranslation();
    const userInfo = getUserInfoFromCookie();
    return (
        <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Flex gap={4}>
                            <Typography.Title level={3}>{t("account.my_account.driver_license")}</Typography.Title>
                        </Flex>
                        {!onEdit && (<Button icon={<EditOutlined />} type="dashed" onClick={() => setOnEdit(true)}>Chỉnh sửa</Button>)}
                        {onEdit && (<Flex gap={4} align="center">
                            <Button type="default" onClick={() => setOnEdit(false)}>{t("common.cancel")}</Button>
                            <Button type="primary" onClick={handleUpdateLicense} loading={loading}>{t("common.update")}</Button>
                        </Flex>)}
                    </Flex>
                </Col>
                <Col span={12}>
                    <Flex gap={5} align="center" className="mb-5">
                        <Typography.Title style={{
                            marginBottom: 0
                        }} level={4}>{t("common.image")}</Typography.Title>
                        <Upload
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            onRemove={handleRemove}
                            disabled={!onEdit}
                        >
                            {fileList.length < 1 && (
                                <Button icon={<UploadOutlined />}>{t("common.selectFile")}</Button>
                            )}
                        </Upload>
                    </Flex>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col span={12}>
                    <Form layout="vertical">
                        <Typography.Title level={4}>{t("account.my_account.driver_license.general")}</Typography.Title>
                        <Form.Item label={t("account.my_account.driver_license.id")}>
                            <Input disabled value={userInfo?.car_license?.id} />
                        </Form.Item>
                        <Form.Item label={t("account.my_account.driver_license.fullName")}>
                            <Input disabled value={userInfo?.car_license?.full_name} />
                        </Form.Item>
                        <Form.Item label={t("account.my_account.driver_license.dob")}>
                            <Input disabled value={convertTimestampToDayjs(Number(userInfo?.car_license?.dob))?.format("DD/MM/YYYY")} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Col>
    );
};

export default UserLicenseCard;