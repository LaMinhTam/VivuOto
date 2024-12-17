import { View, Text, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DatePicker, Flex, Form, Input, Radio, Checkbox, Toast } from '@ant-design/react-native';
import { IVehicleHandoverResponseData, HandoverFieldTypes } from '../../store/rental/types';
import { convertDateToTimestamp, formatDate, handleMetaMaskSignature } from '../../utils';
import { Chip } from 'react-native-elements';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { createVehicleHandover, lesseeReturnVehicle } from '../../store/rental/handlers';
import { useTranslation } from 'react-i18next';

const CreateVehicleHandover = ({ visible, setVisible, userId, contractId, setVehicleHandover }: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    contractId: string;
    setVehicleHandover: (vehicleHandover: IVehicleHandoverResponseData) => void;
}) => {
    const [form] = Form.useForm();
    const [handoverDate, setHandoverDate] = useState<Date | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<'NORMAL' | 'DAMAGE'>('NORMAL');
    const [damages, setDamages] = useState<string[]>([]);
    const [damageInput, setDamageInput] = useState<string>('');
    const [collateral, setCollateral] = useState<{ type: string; details: string }[]>([]);
    const [collateralType, setCollateralType] = useState<string>('');
    const [collateralValue, setCollateralValue] = useState<string>('');
    const { open, isConnected, address, provider } = useWalletConnectModal();
    const { t } = useTranslation();
    const onSubmit = () => {
        form.submit();
    }

    const addDamage = () => {
        if (damageInput.trim()) {
            setDamages([...damages, damageInput]);
            setDamageInput('');
        }
    };

    const removeDamage = (index: number) => {
        setDamages(damages.filter((_, i) => i !== index));
    };

    const addCollateral = () => {
        if (collateralType.trim() && collateralValue.trim()) {
            setCollateral([...collateral, { type: collateralType, details: collateralValue }]);
            setCollateralType('');
            setCollateralValue('');
        } else {
            Toast.fail(t("require"));
        }
    };

    const removeCollateral = (index: number) => {
        setCollateral(collateral.filter((_, i) => i !== index));
    };

    const onFinish = async (values: any) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        if (!isConnected) {
            await open();
            Toast.remove(key);
        } else {
            const signatureResult = await handleMetaMaskSignature(userId, provider);
            const digital_signature = {
                signature: signatureResult.signature,
                message: signatureResult.msg,
                address: signatureResult.account,
                signature_url: 'https://picsum.photos/200'
            };
            if (digital_signature?.signature) {

                const requestBody = {
                    ...values,
                    initial_condition_normal: true,
                    rental_contract_id: contractId,
                    handover_date: convertDateToTimestamp(values.handover_date),
                    damages,
                    collateral: collateral,
                    digital_signature
                };
                const response = await createVehicleHandover(requestBody);
                if (response?.success) {
                    Toast.remove(key);
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    Toast.success(t("msg.CREATE_VEHICLE_HANDOVER_SUCCESS"), 1);
                    setVisible(false);
                } else {
                    Toast.remove(key);
                    Toast.fail(t("msg.CREATE_VEHICLE_HANDOVER_FAILED"), 1);
                }
            } else {
                Toast.remove(key);
                Toast.fail(t("msg.METAMASK_SIGNATURE_FAILED"), 1);
            }
        }
    };

    const handleStatusChange = (status: 'NORMAL' | 'DAMAGE') => {
        setSelectedStatus(status);
    };

    return (
        <ScrollView className='w-full h-[600px]'>
            <Form
                name='create-vehicle-handover'
                form={form}
                onFinish={onFinish}
                renderHeader={t("account.rental_contract.create_handover")}
                initialValues={{
                    handover_date: new Date(),
                    vehicle_condition: selectedStatus,
                    odometer_reading: '',
                    fuel_level: '',
                    personal_items: '',
                }}
            >

                <Form.Item<HandoverFieldTypes>
                    label={t("account.rental_contract.handover_date")}
                    name='handover_date'
                    rules={[{ required: true, message: t("require") }]}
                >
                    <DatePicker
                        value={handoverDate}
                        precision="minute"
                        onChange={(date) => setHandoverDate(date)}
                        format="YYYY-MM-DD"
                    >
                        <Text className="p-2 ml-5 border border-gray-300 rounded">{formatDate(handoverDate || new Date())}</Text>
                    </DatePicker>
                </Form.Item>
                <Form.Item<HandoverFieldTypes>
                    label={t("account.rental_contract.vehicle_condition")}
                    name='vehicle_condition'
                    rules={[{ required: true, message: t("require") }]}
                >
                    <Flex style={{ marginLeft: 10 }}>
                        <Chip
                            title={t("common.NORMAL")}
                            type={selectedStatus === 'NORMAL' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('NORMAL')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                        <Chip
                            title={t("common.DAMAGE")}
                            type={selectedStatus === 'DAMAGE' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('DAMAGE')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                    </Flex>
                </Form.Item>
                <Form.Item<HandoverFieldTypes>
                    label={t("account.rent_contract.fuel_level")}
                    name='fuel_level'
                    rules={[{ required: true, message: t("require") }]}
                >
                    <Input type='number' placeholder={t("account.rent_contract.fuel_level")} allowClear style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<HandoverFieldTypes>
                    label={t("account.rental_contract.odometer_reading")}
                    name='odometer_reading'
                    rules={[{ required: true, message: t("require") }]}
                >
                    <Input type='number' placeholder={t("account.rental_contract.odometer_reading")} allowClear style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<HandoverFieldTypes>
                    label={t("account.rental_contract.personal_items")}
                    name='personal_items'
                >
                    <Input type='default' placeholder={t("account.rental_contract.personal_items")} allowClear style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item label={t("account.rental_contract.damages")}>
                    <Flex direction='row' align='center'>
                        <Input
                            value={damageInput}
                            onChangeText={setDamageInput}
                            placeholder={t("account.rental_contract.add_damage")}
                            style={{ marginLeft: 10, width: '80%' }}
                        />
                        <Button mode='text' onPress={addDamage} style={{ marginLeft: 10 }}>{t("common.add")}</Button>
                    </Flex>
                    <Flex direction='row' align='center' wrap='wrap' justify='start' style={{
                        gap: 10
                    }}>
                        {damages.map((damage, index) => (
                            <Flex key={index} style={{ marginLeft: 10 }}>
                                <Chip
                                    title={damage}
                                    type={'outline'}
                                />
                                <Icon name="close" size={16} color="black" onPress={() => removeDamage(index)} />
                            </Flex>
                        ))}
                    </Flex>
                </Form.Item>
                <Form.Item label={t("account.rental_contract.collateral")}>
                    <Flex direction="column" align="center" justify="start" style={{ marginBottom: 10 }}>
                        <Flex direction='row' align='center' justify='between' style={{ marginLeft: 10 }}>
                            <View className='flex-1'>
                                <Input
                                    value={collateralType}
                                    onChangeText={setCollateralType}
                                    placeholder={t("account.rental_contract.collateral_type")}
                                    style={{ flex: 1, marginRight: 10 }}
                                />
                                <Input
                                    value={collateralValue}
                                    onChangeText={setCollateralValue}
                                    placeholder={t("account.rental_contract.collateral_detail")}
                                    style={{ flex: 1, marginRight: 10 }}
                                />
                            </View>
                            <Button mode="text" onPress={addCollateral}>
                                {t("common.add")}
                            </Button>
                        </Flex>
                    </Flex>

                    {/* Display List of Collateral */}
                    {collateral.length > 0 && (
                        <View style={{ marginVertical: 10 }}>
                            {collateral.map((item, index) => (
                                <Flex
                                    key={index}
                                    direction="row"
                                    align="center"
                                    justify="between"
                                    style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                                >
                                    <Text className='text-text8'>{`${item.type}: ${item.details}`}</Text>
                                    <Icon
                                        name="close"
                                        size={20}
                                        color="red"
                                        onPress={() => removeCollateral(index)}
                                    />
                                </Flex>
                            ))}
                        </View>
                    )}
                </Form.Item>
                <Flex align='center' justify='end' style={{
                    padding: 10,
                    gap: 10,
                    backgroundColor: '#f9f9f9',
                }}>
                    <Button mode='contained' className='bg-error' onPress={() => setVisible(false)}>{t("common.cancel")}</Button>
                    <Button mode='contained' className='bg-text8' onPress={onSubmit}>{t("common.create")}</Button>
                </Flex>
            </Form>
        </ScrollView>
    );
};

export default CreateVehicleHandover;