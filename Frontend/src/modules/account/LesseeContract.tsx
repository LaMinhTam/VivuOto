import { useEffect, useMemo, useState } from "react";
import { Modal, Table, Tag, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GET_LESSEE_CONTRACTS } from "../../store/rental/action";
import { RootState } from "../../store/store";
import { IContractData, IContractParams } from "../../store/rental/types";
import { TablePaginationConfig } from "antd/es/table";
import { formatPrice } from "../../utils";
import LesseeContractModal from "../../components/modals/LesseeContractModal";
import { useNavigate, useParams } from "react-router-dom";
import { getContractById } from "../../store/rental/handlers";
import { useTranslation } from "react-i18next";

const LesseeContract = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { lesseeListContract, loading } = useSelector((state: RootState) => state.rental);
    const [modalRecord, setModalRecord] = useState<IContractData>({} as IContractData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();

    const [params, setParams] = useState<IContractParams>({
        sortDescending: "true",
        page: "0",
        size: "10",
        status: "",
    });

    useEffect(() => {
        if (id) {
            fetchRentalContractById(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, lesseeListContract]);

    const fetchRentalContractById = async (id: string) => {
        const response = await getContractById(id);
        if (response?.success && response.data) {
            setModalRecord(response.data);
            showModal();
        }
    };

    useMemo(() => {
        dispatch({ type: GET_LESSEE_CONTRACTS, payload: params });
    }, [dispatch, params]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
    ) => {
        setParams({
            ...params,
            page: String((pagination.current ?? 1) - 1),
            size: String(pagination.pageSize ?? 10),
        });
    };

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_text: string, _record: IContractData, index: number) => index + 1,
        },
        {
            title: t("account.rent_contract.status"),
            dataIndex: 'rental_status',
            key: 'rental_status',
            render: (status: string) => {
                let color = '';
                switch (status) {
                    case 'SIGNED':
                        color = 'green';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'CANCELED':
                        color = 'red';
                        break;
                    default:
                        color = 'blue';
                        break;
                }
                return <Tag color={color}>{t(`common.${status}`)}</Tag>;
            },
        },
        {
            title: t("account.rent_contract.created_at"),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: t("account.rent_contract.vehicle_license_plate"),
            dataIndex: 'vehicle_license_plate',
            key: 'vehicle_license_plate',
        },
        {
            title: t("account.rent_contract.total_rental_value"),
            dataIndex: 'total_rental_value',
            key: 'total_rental_value',
            render: (value: number) => formatPrice(value) + ' VND',
        },
        {
            title: t("account.rent_contract.vehicle_hand_over_location"),
            dataIndex: 'vehicle_hand_over_location',
            key: 'vehicle_hand_over_location',
        },
        {
            title: t("common.action"),
            key: 'action',
            render: (_text: string, record: IContractData) => (
                <Typography.Link onClick={() => handleViewDetail(record)}>{t("common.viewDetail")}</Typography.Link>
            ),
        },
    ];

    const handleViewDetail = (record: IContractData) => {
        setModalRecord(record);
        showModal();
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        navigate('/account/lessee-contract', { replace: true });
        setParams({ ...params })
        setIsModalOpen(false);
    };

    return (
        <div className="p-4">
            <Typography.Title level={3}>{t("account.rent_contract.list")}</Typography.Title>
            <Table
                className="w-full"
                columns={columns}
                dataSource={lesseeListContract?.data}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: Number(params.size),
                    current: Number(params.page) + 1,
                    total: lesseeListContract?.meta.item_count,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={handleTableChange}
            />
            <Modal maskClosable={false} destroyOnClose={true} title={t("account.rent_contract.detail")} open={isModalOpen} footer={false} width={860} onCancel={handleCancel}>
                <LesseeContractModal record={modalRecord}></LesseeContractModal>
            </Modal>
        </div>
    );
};

export default LesseeContract;
