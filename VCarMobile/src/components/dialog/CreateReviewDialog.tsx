import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Form, TextareaItem, Toast } from '@ant-design/react-native';
import { Rating } from 'react-native-ratings';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { createReview } from '../../store/rental/handlers';

interface FieldValues {
    rating: number;
    comment: string;
}

const CreateReviewDialog = ({ visible, setVisible, contract_id }: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    contract_id: string;
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: FieldValues) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        setLoading(true);
        const response = await createReview({
            rental_contract_id: contract_id,
            rating: values.rating,
            comment: values.comment,
        });
        if (response?.success) {
            Toast.remove(key);
            Toast.success(t("msg.CREATE_REVIEW_SUCCESS"));
            setVisible(false);
            form.resetFields();
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.CREATE_REVIEW_FAILED"));
        }
        setLoading(false);
    };

    return (
        <ScrollView className='w-full h-[400px]'>
            <Form
                form={form}
                onFinish={onFinish}
                renderHeader={t("common.createReview")}
                initialValues={{
                    rating: 0,
                    comment: '',
                }}
            >
                <Form.Item<FieldValues>
                    name="rating"
                    label={t("common.rating")}
                    rules={[{ required: true, message: t("require") }]}
                >
                    <View className="items-center py-4">
                        <Rating
                            type="custom"
                            ratingCount={5}
                            imageSize={30}
                            startingValue={0}
                            onFinishRating={(rating: number) => {
                                form.setFieldsValue({ rating });
                            }}
                        />
                    </View>
                </Form.Item>

                <Form.Item<FieldValues>
                    name="comment"
                    label={t("common.comment")}
                    rules={[{ required: true, message: t("require") }]}
                >
                    <TextareaItem
                        rows={4}
                        placeholder={t("common.comment")}
                        count={100}
                    />
                </Form.Item>

                <View className="flex-row justify-end p-4 space-x-2 bg-gray-50">
                    <Button
                        mode="outlined"
                        onPress={() => setVisible(false)}
                        className="mr-2"
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => form.submit()}
                        loading={loading}
                        className="bg-primary"
                    >
                        {t("common.create")}
                    </Button>
                </View>
            </Form>
        </ScrollView>
    );
};

export default CreateReviewDialog;