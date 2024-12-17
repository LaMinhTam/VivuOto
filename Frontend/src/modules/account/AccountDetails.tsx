import { Col, message, Row, Spin, Tabs, TabsProps, Typography, UploadFile } from "antd";
import { connectWallet, getAccessToken, getUserInfoFromCookie, getWalletBalance, handleRecognizeCitizenIdentification, handleRecognizeLicensePlate, handleUploadFile, saveUserInfoToCookie } from "../../utils";
import { useState, useEffect, useMemo } from "react";
import { UploadProps } from "antd/es/upload";
import { useDispatch } from "react-redux";
import { buyToken, getMe, updateCitizenLicense, updateLicense, updateMetamaskAddress } from "../../store/profile/handlers";
import ProfileCard from "./account-details/ProfileCard";
import WalletCard from "./account-details/WalletCard";
import UserLicenseCard from "./account-details/UserLicenseCard";
import UserIdentificationCard from "./account-details/UserIdentificationCard";
import StatisticCard from "./account-details/StatisticCard";
import { CarStatisticsParamsType, ContractParamsType, ContractUserParamsType, InvoiceSummaryParamsType } from "../../store/stats/types";
import { CarStatisticsParams, ContractParams, ContractUserParams, InvoiceSummaryParams } from "../../store/stats/models";
import { formatDateToDDMMYYYY } from "../../utils/helper";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import CarStatisticCard from "./account-details/CarStatisticCard";
import { useAuth } from "../../contexts/auth-context";
import InvoiceStatisticCard from "./account-details/InvoiceStatisticCard";
import UserStatisticCard from "./account-details/UserStatisticCard";
// import CarProvinceStatisticCard from "./account-details/CarProvinceStatisticCard";
import RentalVolumeStatisticCard from "./account-details/RentalVolumeStatisticCard";

const AccountDetails = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { role } = useAuth();
    const [onEdit, setOnEdit] = useState(false);
    const [onEditIdentification, setOnEditIdentification] = useState(false);
    const userInfo = getUserInfoFromCookie();
    const [imageUrl, setImageUrl] = useState<string | null>(userInfo?.car_license?.license_image_url || null);
    const [identificationImageUrl, setIdentificationImageUrl] = useState<string | null>(userInfo?.citizen_identification?.citizen_identification_image || null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fileListIdentification, setFileListIdentification] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refetchMe, setRefetchMe] = useState(false);
    const [metamaskInfo, setMetamaskInfo] = useState<{
        account: string;
        balance: string;
    }>({
        account: "",
        balance: "",
    });


    const [lessorParams, setLessorParams] = useState<ContractParamsType>({
        ...ContractParams,
        startDate: formatDateToDDMMYYYY(dayjs().startOf('year').toDate()),
        endDate: formatDateToDDMMYYYY(dayjs().endOf('year').toDate()),
        lessor: userInfo?.id || '',
    });
    const [lesseeParams, setLesseeParams] = useState<ContractParamsType>({
        ...ContractParams,
        startDate: formatDateToDDMMYYYY(dayjs().startOf('year').toDate()),
        endDate: formatDateToDDMMYYYY(dayjs().endOf('year').toDate()),
        lessee: userInfo?.id || '',
    });
    const [carParams, setCarParams] = useState<CarStatisticsParamsType>({
        ...CarStatisticsParams,
        startDate: formatDateToDDMMYYYY(dayjs().startOf('year').toDate()),
        endDate: formatDateToDDMMYYYY(dayjs().endOf('year').toDate()),
        owner: userInfo?.id || '',
    });
    const [invoiceParams, setInvoiceParams] = useState<InvoiceSummaryParamsType>({
        ...InvoiceSummaryParams,
        startDate: formatDateToDDMMYYYY(dayjs().startOf('year').toDate()),
        endDate: formatDateToDDMMYYYY(dayjs().endOf('year').toDate()),
        type: 'RENT',
    });

    const [userParams, setUserParams] = useState<ContractUserParamsType>({
        ...ContractUserParams,
        startDate: formatDateToDDMMYYYY(dayjs().startOf('year').toDate()),
        endDate: formatDateToDDMMYYYY(dayjs().endOf('year').toDate()),
        filterByLessor: "true",
        sortOrder: "asc",
    });

    useEffect(() => {
        async function fetchMetamaskInfo() {
            const address = await connectWallet();
            if (address) {
                const balance = await getWalletBalance(address, t);
                setMetamaskInfo({
                    account: address,
                    balance: balance?.toString() || "0",
                });
            }
        }
        fetchMetamaskInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchMe])

    const handleDepositToken = async () => {
        setLoading(true);
        const response = await buyToken();
        if (response?.success) {
            const vnpayUrl = response?.data
            if (vnpayUrl) {
                window.location.href = vnpayUrl;
                setLoading(false);
            }
        } else {
            setLoading(false);
            message.error(t("msg.DEPOSIT_TOKEN_FAILED"));
        }
    }

    const handleCheckSyncWallet = async () => {
        setLoading(true);
        const address = await connectWallet();
        if (address) {
            const balance = await getWalletBalance(address, t);
            setMetamaskInfo({
                account: address,
                balance: balance?.toString() || "0",
            });
            const response = await updateMetamaskAddress(address);
            if (response?.success) {
                setLoading(false);
                message.success(t("msg.SYNC_WALLET_SUCCESS"));
            } else {
                setLoading(false);
                message.error(t("msg.SYNC_WALLET_FAILED"));
            }
        }
    }

    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            const newImageUrl = URL.createObjectURL(file);
            setImageUrl(newImageUrl);
        } else {
            setImageUrl(null);
        }
    };

    const handleChangeIdentification: UploadProps["onChange"] = ({ fileList }) => {
        console.log(fileList);
        setFileListIdentification(fileList);
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            const newImageUrl = URL.createObjectURL(file);
            setIdentificationImageUrl(newImageUrl);
        } else {
            setIdentificationImageUrl(null);
        }
    }

    const handleUpdateCitizenIdentification = async () => {
        setLoading(true);
        const formData = new FormData();

        if (fileListIdentification.length > 0) {
            const file = fileListIdentification[0].originFileObj as File;
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append("folder", `users/${userInfo?.id}/citizen_identification`);

            // First, upload the file to Cloudinary
            const imageUrl = await handleUploadFile(formData, dispatch);

            if (imageUrl) {

                // Prepare data for driver's license recognition API
                const recognitionData = new FormData();
                recognitionData.append("image", file);

                // Send the image URL to the license recognition API
                const res = await handleRecognizeCitizenIdentification(recognitionData);
                if (res?.success) {
                    let dob = res?.data?.dob || "";
                    if (dob) {
                        const [day, month, year] = dob.split('/');
                        dob = `${year}-${month}-${day}`;
                    }
                    let doe = res?.data?.doe || "";
                    if (doe) {
                        const [day, month, year] = doe.split('/');
                        doe = `${year}-${month}-${day}`;
                    }
                    const updateResponse = await updateCitizenLicense({
                        identification_number: res?.data?.id || "",
                        issued_date: doe,
                        issued_location: res?.data?.address_entities?.province || "",
                        permanent_address: res?.data?.address || "",
                        contact_address: res?.data?.address || "",
                        identification_image_url: imageUrl,
                    })
                    if (updateResponse?.success) {
                        setLoading(false);
                        message.success(t("msg.UPDATE_CITIZEN_IDENTIFICATION_SUCCESS"));
                        setOnEditIdentification(false);
                        setRefetchMe(!refetchMe);
                    } else {
                        setLoading(false);
                        message.error(t("msg.UPDATE_CITIZEN_IDENTIFICATION_FAILED"));
                    }
                } else {
                    setLoading(false);
                    message.error(t("msg.RECOGNIZE_FAIL"));
                }
            } else {
                setLoading(false);
                message.error(t("msg.UPLOAD_FAILURE"));
            }
        }
    }

    const handleUpdateLicense = async () => {
        setLoading(true);
        const formData = new FormData();

        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append("folder", `users/${userInfo?.id}/car_license`);

            // First, upload the file to Cloudinary
            const imageUrl = await handleUploadFile(formData, dispatch);

            if (imageUrl) {
                // Prepare data for driver's license recognition API
                const recognitionData = new FormData();
                recognitionData.append("image", file);

                // Send the image URL to the license recognition API
                const res = await handleRecognizeLicensePlate(recognitionData);
                if (res?.success) {
                    let dob = res?.data?.dob || "";
                    if (dob) {
                        const [day, month, year] = dob.split('/');
                        dob = `${year}-${month}-${day}`;
                    }
                    const updateResponse = await updateLicense({
                        id: res?.data?.id || "",
                        full_name: res?.data?.name || "",
                        dob: dob,
                        license_image_url: imageUrl,
                    })
                    if (updateResponse?.success) {
                        setLoading(false);
                        message.success(t("msg.UPDATE_LICENSE_SUCCESS"));
                        setOnEdit(false);
                        setRefetchMe(!refetchMe);
                    } else {
                        setLoading(false);
                        message.error(t("msg.UPDATE_LICENSE_FAILED"));
                    }
                } else {
                    setLoading(false);
                    message.error(t("msg.RECOGNIZE_FAIL"));
                }
            } else {
                setLoading(false);
                message.error(t("msg.UPLOAD_FAILURE"));
            }
        }
    };

    const handleRemove = () => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(null);
    };

    useMemo(() => {
        async function fetchMe() {
            const accessToken = getAccessToken();
            const res = await getMe();
            if (res?.success && res?.data) {
                saveUserInfoToCookie(res?.data, accessToken || '');
            }
        }
        fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchMe])

    const handleRemoveIdentification = () => {
        if (identificationImageUrl) {
            URL.revokeObjectURL(identificationImageUrl);
        }
        setIdentificationImageUrl(null);
    }

    useEffect(() => {
        return () => {
            // Clean up the object URL when the component unmounts
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            if (identificationImageUrl) {
                URL.revokeObjectURL(identificationImageUrl);
            }
        };
    }, [identificationImageUrl, imageUrl]);

    const userTabs: TabsProps['items'] = [
        {
            key: '1',
            label: t(`stat.lessor.rental`),
            children: <StatisticCard params={lessorParams} setParams={setLessorParams} type="LESSOR" />,
        },
        {
            key: '2',
            label: t(`stat.lessee.rental`),
            children: <StatisticCard params={lesseeParams} setParams={setLesseeParams} type="LESSEE" />,
        },
        {
            key: '3',
            label: t(`stat.car`),
            children: <CarStatisticCard params={carParams} setParams={setCarParams} />,
        }
    ];

    const adminTabs = [
        {
            key: '1',
            label: t(`stat.admin.order`),
            children: <InvoiceStatisticCard params={invoiceParams} setParams={setInvoiceParams} />,
        },
        {
            key: '2',
            label: t(`stat.admin.users`),
            children: <UserStatisticCard params={userParams} setParams={setUserParams} />,
        },
        // {
        //     key: '3',
        //     label: t(`stat.admin.cars`),
        //     children: <CarProvinceStatisticCard />,
        // }
        {
            key: '3',
            label: t(`stat.admin.rentalVolume`),
            children: <RentalVolumeStatisticCard />,
        }
    ]

    return (
        <Spin spinning={loading}>
            <Row gutter={[0, 16]}>
                <ProfileCard
                    refetchMe={refetchMe}
                    setRefetchMe={setRefetchMe}
                />
                <WalletCard
                    loading={loading}
                    handleDepositToken={handleDepositToken}
                    handleCheckSyncWallet={handleCheckSyncWallet}
                    metamaskInfo={metamaskInfo}
                />
                <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
                    <Typography.Title level={3}>{t('stat.title')}</Typography.Title>
                    <Tabs defaultActiveKey="1" items={role === "ROLE_USER" ? userTabs : adminTabs} />
                </Col>
                <UserLicenseCard
                    onEdit={onEdit}
                    setOnEdit={setOnEdit}
                    fileList={fileList}
                    handleChange={handleChange}
                    handleRemove={handleRemove}
                    imageUrl={imageUrl || ""}
                    handleUpdateLicense={handleUpdateLicense}
                    loading={loading}
                />
                <UserIdentificationCard
                    onEditIdentification={onEditIdentification}
                    setOnEditIdentification={setOnEditIdentification}
                    fileListIdentification={fileListIdentification}
                    handleChangeIdentification={handleChangeIdentification}
                    handleRemoveIdentification={handleRemoveIdentification}
                    identificationImageUrl={identificationImageUrl || ""}
                    handleUpdateCitizenIdentification={handleUpdateCitizenIdentification}
                    loading={loading}
                />
            </Row>
        </Spin>
    );
};

export default AccountDetails;