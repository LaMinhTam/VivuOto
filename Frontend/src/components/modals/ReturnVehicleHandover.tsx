import { useRef, useState } from 'react';
import { Col, DatePicker, Row, Form, Input, Select, Button, Tag, Space, message, FormProps, FormInstance, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
import SignatureCanvas from 'react-signature-canvas';
import { convertDateToTimestamp, getUserInfoFromCookie, handleMetaMaskSignature, handleUploadSignature } from '../../utils';
import { useDispatch } from 'react-redux';
import { IVehicleHandoverResponseData, ReturnHandoverFieldTypes } from '../../store/rental/types';
import { lesseeReturnVehicle } from '../../store/rental/handlers';

const ReturnVehicleHandover = ({ form, vehicle_handover_id, setReturnVehicleLoading, setVehicleHandover }: {
    form: FormInstance<ReturnHandoverFieldTypes>
    vehicle_handover_id: string
    setReturnVehicleLoading: (loading: boolean) => void
    setVehicleHandover: (data: IVehicleHandoverResponseData) => void
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userInfo = getUserInfoFromCookie();
    const [damages, setDamages] = useState<string[]>([]);
    const [damageInput, setDamageInput] = useState<string>('');
    const [returnedItems, setReturnedItems] = useState<string[]>([]);
    const [returnedItemInput, setReturnedItemInput] = useState<string>('');
    const sigCanvas = useRef<SignatureCanvas>(null);

    const addDamage = () => {
        if (damageInput.trim()) {
            setDamages([...damages, damageInput]);
            setDamageInput('');
        }
    };

    const removeDamage = (index: number) => {
        setDamages(damages.filter((_, i) => i !== index));
    };

    const addReturnedItem = () => {
        if (returnedItemInput.trim()) {
            setReturnedItems([...returnedItems, returnedItemInput]);
            setReturnedItemInput('');
        }
    };

    const removeReturnedItem = (index: number) => {
        setReturnedItems(returnedItems.filter((_, i) => i !== index));
    };

    const onFinish = async (values: ReturnHandoverFieldTypes) => {
        setReturnVehicleLoading(true);
        if (sigCanvas?.current) {
            const imageUrl = await handleUploadSignature(sigCanvas, dispatch, vehicle_handover_id, userInfo.id, setReturnVehicleLoading);
            if (imageUrl) {
                const signatureResult = await handleMetaMaskSignature(userInfo.id);
                if (!signatureResult) {
                    message.error(t("msg.METAMASK_SIGNATURE_FAILED"));
                    return;
                }
                const digital_signature = {
                    signature: signatureResult.signature,
                    message: signatureResult.msg,
                    address: signatureResult.account,
                    signature_url: imageUrl
                };
                const requestBody = {
                    ...values,
                    return_date: convertDateToTimestamp(values.return_date),
                    damages,
                    returned_items: returnedItems,
                    digital_signature
                };
                const response = await lesseeReturnVehicle(requestBody, vehicle_handover_id);
                if (response?.success) {
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    setReturnVehicleLoading(false);
                    message.success(t("msg.CREATE_RETURN_HANDOVER_SUCCESS"));
                } else {
                    setReturnVehicleLoading(false);
                    message.error(t("msg.CREATE_RETURN_HANDOVER_FAILED"));
                }
            } else {
                setReturnVehicleLoading(false);
                message.error(t("msg.UPLOAD_SIGNATURE_FAILED"));
            }
        } else {
            message.error(t("msg.METAMASK_SIGNATURE_FAILED"));
            setReturnVehicleLoading(false);
        }
        setReturnVehicleLoading(false);
    };

    const onFinishFailed: FormProps<ReturnHandoverFieldTypes>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="return_date"
                        label={t("account.rent_contract.returned_time")}
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <DatePicker showTime />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="vehicle_condition"
                        label="Tình trạng xe"
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <Select className="w-full">
                            <Option value="normal">{t("common.normal")}</Option>
                            <Option value="damage">{t("common.damage")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="odometer_reading"
                        label={t("account.rent_contract.odometer_reading")}
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <Input type="number" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="fuel_level"
                        label={t("account.rent_contract.fuel_level")}
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <Input type="number" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="personal_items"
                        label={t("account.rent_contract.personal_items")}>
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name={"condition_matches_initial"}
                        required
                        label={t("account.rent_contract.condition_matches_initial")}
                        valuePropName="checked"
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <Checkbox></Checkbox>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label={t("account.rent_contract.damage")} className="overflow-auto max-h-32">
                        <Space direction="horizontal" wrap className="w-full">
                            {damages.map((damage, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeDamage(index)}
                                    color='#f50'>
                                    {damage}
                                </Tag>
                            ))}
                        </Space>
                        <Space direction="horizontal" className={`${damages?.length > 0 ? 'mt-2' : ''} w-full`}>
                            <Input
                                value={damageInput}
                                onChange={(e) => setDamageInput(e.target.value)}
                                className="w-full"
                            />
                            <Button type="dashed" onClick={addDamage} icon={<PlusOutlined />}>
                                {t("account.rent_contract.add_damage")}
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Tài sản trả lại">
                        <Space direction="horizontal" wrap className="w-full">
                            {returnedItems.map((item, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeReturnedItem(index)}
                                    color='#2db7f5'>
                                    {item}
                                </Tag>
                            ))}
                        </Space>
                        <Space direction="horizontal" className={`${returnedItems?.length > 0 ? 'mt-2' : ''} w-full`}>
                            <Input
                                value={returnedItemInput}
                                onChange={(e) => setReturnedItemInput(e.target.value)}
                                className="w-full"
                            />
                            <Button type="dashed" onClick={addReturnedItem} icon={<PlusOutlined />}>
                                {t("account.rent_contract.add_returned_items")}
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label={t("common.signature")}
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{
                                className: 'sigCanvas',
                                width: 400,
                                height: 150,
                                style: { border: '1px solid #000' }
                            }}
                        />
                        <Button onClick={() => sigCanvas.current?.clear()} type='text'>{t("common.deleteSignature")}</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form >
    );
};

export default ReturnVehicleHandover;
