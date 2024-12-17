import { Form, Input, Rate, Button } from 'antd';
import { useState } from 'react';
import { createReview } from '../../store/rental/handlers';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

interface FieldValues {
    rating: number;
    comment: string;
}

const CreateReviewModal = ({ contract_id, setOpen }: {
    contract_id: string;
    setOpen: (open: boolean) => void;
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleFinish = async (values: FieldValues) => {
        setLoading(true);
        const response = await createReview({
            rental_contract_id: contract_id,
            rating: values.rating,
            comment: values.comment,
        });
        if (response?.success) {
            setOpen(false);
            form.resetFields();
        } else {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Form.Item<FieldValues>
                name="rating"
                label={t("car.rating")}
                rules={[{ required: true, message: t("require") }]}
            >
                <Rate />
            </Form.Item>
            <Form.Item<FieldValues>
                name="comment"
                label={t("common.comment")}
                rules={[{ required: true, message: t("require") }]}
            >
                <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {t("common.create")}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateReviewModal;