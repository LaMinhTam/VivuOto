import { CarOutlined, DeploymentUnitOutlined, IdcardOutlined, MoneyCollectOutlined, PictureOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, message, Spin, Tabs, TabsProps } from "antd";
import CarInformationTab from "../../modules/cars/CarInformationTab";
import { ICreateCarData } from "../../store/car/types";
import CarFeatureTab from "../../modules/cars/CarFeatureTab";
import CarLicenseTab from "../../modules/cars/CarLicenseTab";
import CarImageTab from "../../modules/cars/CarImageTab";
import { useEffect, useMemo, useState } from "react";
import { UploadFile } from "antd/es/upload";
import JoditEditor from 'jodit-react';
import RentFeeTab from "../../modules/cars/RentFeeTab";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
import { getUserInfoFromCookie, handleUploadFile } from "../../utils";
import { useDispatch } from "react-redux";
import { updateCar } from "../../store/car/handlers";
import { useTranslation } from "react-i18next";

const config = {
    uploader: {
        insertImageAsBase64URI: false,
    },
    allowResizeX: false,
    allowResizeY: false,
    minWidth: 952,
    maxWidth: 952,
    width: 952,
}

const EditCarModal = ({ id, carData, setOpen, setRefetchCarData, refetchCarData }: {
    id: string
    carData: ICreateCarData;
    setOpen: (open: boolean) => void;
    setRefetchCarData: (refetch: boolean) => void;
    refetchCarData: boolean;
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userInfo = getUserInfoFromCookie();
    const [loading, setLoading] = useState(false);
    const [screenShot, setScreenShot] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (carData?.image_url?.length && screenShot.length === 0) {
            const initialFileList: UploadFile[] = carData.image_url.map((url) => ({
                uid: `${uuidv4()}`,
                name: `image-${uuidv4()}.jpg`,
                status: 'done',
                url: url,
            }));
            setScreenShot(initialFileList);
        }
    }, [carData, screenShot]);

    useMemo(() => {
        form.setFieldsValue({
            ...carData,
            manufacturing_year: carData.manufacturing_year ? dayjs().year(carData.manufacturing_year) : null,
            registration_date: carData.registration_date ? dayjs(carData?.registration_date) : null,
        });
    }, [carData, form])

    const onFinish = async (values: ICreateCarData) => {
        setLoading(true);
        const newValues = {
            ...values,
            manufacturing_year: dayjs(values.manufacturing_year).year(),
            registration_date: dayjs(values.registration_date).format('YYYY-MM-DD'),
        };
        const images = screenShot?.map((file) => file?.url)?.filter((url) => url);
        const newImages = screenShot?.filter((file) => !file?.url);
        if (newImages && newImages?.length > 0) {
            const files = newImages.map((shot) => shot.originFileObj as File);
            const uploadPromises = files.map((file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME);
                formData.append('folder', `users/${userInfo?.id}/my_cars/img`);
                return handleUploadFile(formData, dispatch);
            });

            const imageUrls = await Promise.all(uploadPromises);
            if (imageUrls.length === files.length) {
                newValues.image_url = [...images, ...imageUrls];
            } else {
                message.error(t("msg.UPLOAD_FAILURE"));
                setLoading(false);
            }
        } else {
            newValues.image_url = images.filter((url): url is string => !!url);
        }
        const response = await updateCar(newValues, id);
        if (response.success) {
            message.success(t("UPDATE_CAR_SUCCESS"));
            setLoading(false);
            setOpen(false);
            setRefetchCarData(!refetchCarData);
        } else {
            setLoading(false);
            message.error(t("msg.UPDATE_CAR_FAILED"));
        }
    }

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: t("common.car"),
            children: <CarInformationTab />,
            icon: <CarOutlined />,
        },
        {
            key: '2',
            label: t("common.feature"),
            children: <CarFeatureTab features={carData?.features} />,
            icon: <DeploymentUnitOutlined />
        },
        {
            key: '3',
            label: t("common.carLicense"),
            children: <CarLicenseTab />,
            icon: <IdcardOutlined />
        },
        {
            key: '4',
            label: t("common.image"),
            children: <CarImageTab screenShot={screenShot} setScreenShot={setScreenShot} />,
            icon: <PictureOutlined />
        },
        {
            key: '5',
            label: t("common.description"),
            children: <Form.Item
                name="description"
                required
                rules={[
                    {
                        required: true,
                        message: t("common.description.required"),
                    },
                ]}
            >
                <JoditEditor value="" key="description" config={config} />
            </Form.Item>,
            icon: <ProfileOutlined />
        },
        {
            key: '6',
            label: t("common.rentalFeeAndOtherFee"),
            children: <RentFeeTab />,
            icon: <MoneyCollectOutlined />
        }
    ];

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={{
                    ...carData,
                    manufacturing_year: carData.manufacturing_year ? dayjs().year(carData.manufacturing_year) : null,
                    registration_date: carData.registration_date ? dayjs(carData?.registration_date) : null,
                }}
            >
                <Tabs
                    items={tabs}
                    defaultActiveKey="1"
                />
                <Divider></Divider>
                <Flex gap={16} align="center" justify="flex-end">
                    <Button onClick={() => setOpen(false)} type="default" style={{
                        padding: '4px 15px',
                        width: 120
                    }}>{t("common.cancel")}</Button>
                    <Button type="primary" style={{
                        padding: '4px 15px',
                        width: 120
                    }} htmlType="submit">{t("common.update")}</Button>
                </Flex>
            </Form>
        </Spin>
    );
};

export default EditCarModal;
