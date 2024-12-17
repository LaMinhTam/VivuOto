import { View, Text, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DatePicker, Flex, Form, Input, Radio, Checkbox, Toast } from '@ant-design/react-native';
import { IVehicleHandoverResponseData, ReturnHandoverFieldTypes } from '../../store/rental/types';
import { convertDateToTimestamp, formatDate, handleMetaMaskSignature } from '../../utils';
import { Chip } from 'react-native-elements';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { lesseeReturnVehicle } from '../../store/rental/handlers';
import { useTranslation } from 'react-i18next';

const ReturnVehicleHandover = ({ visible, setVisible, userId, handoverId, setVehicleHandover }: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    handoverId: string;
    setVehicleHandover: (vehicleHandover: IVehicleHandoverResponseData) => void;
}) => {
    const [form] = Form.useForm();
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<'NORMAL' | 'DAMAGE'>('NORMAL');
    const [checked, setChecked] = useState(false);
    const [damages, setDamages] = useState<string[]>([]);
    const [damageInput, setDamageInput] = useState<string>('');
    const [returnedItems, setReturnedItems] = useState<string[]>([]);
    const [returnedItemInput, setReturnedItemInput] = useState<string>('');
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

    const addReturnedItem = () => {
        if (returnedItemInput.trim()) {
            setReturnedItems([...returnedItems, returnedItemInput]);
            setReturnedItemInput('');
        }
    };

    const removeReturnedItem = (index: number) => {
        setReturnedItems(returnedItems.filter((_, i) => i !== index));
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
                    condition_matches_initial: checked,
                    return_date: convertDateToTimestamp(values.return_date),
                    damages,
                    returned_items: returnedItems,
                    digital_signature
                };
                const response = await lesseeReturnVehicle(requestBody, handoverId);
                if (response?.success) {
                    Toast.remove(key);
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    Toast.success('Return vehicle handover created successfully');
                    setVisible(false);
                } else {
                    Toast.remove(key);
                    Toast.fail('Failed to create return vehicle handover');
                }
            } else {
                Toast.remove(key);
                Toast.fail('Failed to sign with MetaMask');
            }
        }
    };

    const handleStatusChange = (status: 'NORMAL' | 'DAMAGE') => {
        setSelectedStatus(status);
    };

    return (
        <ScrollView className='w-full h-[600px]'>
            <Form
                name='return-vehicle-handover'
                form={form}
                onFinish={onFinish}
                renderHeader="Return Vehicle Handover"
                initialValues={{
                    return_date: new Date(),
                    vehicle_condition: selectedStatus,
                    odometer_reading: '',
                    fuel_level: '',
                    personal_items: '',
                    condition_matches_initial: false,
                }}
            >

                <Form.Item<ReturnHandoverFieldTypes>
                    label='Return Date'
                    name='return_date'
                    rules={[{ required: true, message: 'Please select return date' }]}
                >
                    <DatePicker
                        value={returnDate}
                        precision="minute"
                        onChange={(date) => setReturnDate(date)}
                        format="YYYY-MM-DD"
                    >
                        <Text className="p-2 ml-5 border border-gray-300 rounded">{formatDate(returnDate || new Date())}</Text>
                    </DatePicker>
                </Form.Item>
                <Form.Item<ReturnHandoverFieldTypes>
                    label='Vehicle Condition'
                    name='vehicle_condition'
                    rules={[{ required: true, message: 'Please select vehicle condition' }]}
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
                <Form.Item<ReturnHandoverFieldTypes>
                    label='Odometer Reading'
                    name='odometer_reading'
                    rules={[{ required: true, message: 'Please input odometer reading' }]}
                >
                    <Input type='number' placeholder='Odometer Reading' allowClear style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ReturnHandoverFieldTypes>
                    label='Fuel Level'
                    name='fuel_level'
                    rules={[{ required: true, message: 'Please input fuel level' }]}
                >
                    <Input type='number' placeholder='Fuel Level' allowClear style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ReturnHandoverFieldTypes>
                    label='Personal Items'
                    name='personal_items'
                >
                    <Input type='default' placeholder='Personal Items' allowClear style={{ marginLeft: 10 }} />
                </Form.Item>
                <Form.Item<ReturnHandoverFieldTypes>
                    label='Condition Matches Initial'
                    name='condition_matches_initial'
                    required
                >
                    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{ marginTop: 5, marginLeft: 10 }}></Checkbox>
                </Form.Item>
                <Form.Item label='Damages'>
                    <Flex direction='row' align='center'>
                        <Input
                            value={damageInput}
                            onChangeText={setDamageInput}
                            placeholder='Add damage'
                            style={{ marginLeft: 10, width: '80%' }}
                        />
                        <Button mode='text' onPress={addDamage} style={{ marginLeft: 10 }}>Add</Button>
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
                <Form.Item label='Returned Items'>
                    <Flex direction='row' align='center'>
                        <Input
                            value={returnedItemInput}
                            onChangeText={setReturnedItemInput}
                            placeholder='Add returned item'
                            style={{ marginLeft: 10, width: '75%' }}
                        />
                        <Button mode='text' onPress={addReturnedItem} style={{ marginLeft: 10 }}>Add</Button>
                    </Flex>
                    <Flex direction='row' align='center' wrap='wrap' justify='start' style={{
                        gap: 10
                    }}>
                        {returnedItems.map((item, index) => (
                            <Flex key={index} style={{ marginLeft: 10 }}>
                                <Chip
                                    title={item}
                                    type={'outline'}
                                />
                                <Icon name="close" size={16} color="black" onPress={() => removeReturnedItem(index)} />
                            </Flex>
                        ))}
                    </Flex>
                </Form.Item>
                <Flex align='center' justify='end' style={{
                    padding: 10,
                    gap: 10,
                    backgroundColor: '#f9f9f9',
                }}>
                    <Button mode='contained' className='bg-error' onPress={() => setVisible(false)}>Cancel</Button>
                    <Button mode='contained' className='bg-text8' onPress={onSubmit}>Submit</Button>
                </Flex>
            </Form>
        </ScrollView>
    );
};

export default ReturnVehicleHandover;