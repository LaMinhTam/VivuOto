import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, ColorPicker, Divider, Flex, Modal, Radio, Row, Select, Space, Spin, Table, Tag, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import Search from "antd/es/input/Search";
import { ChangeEvent, useMemo, useState } from "react";
import { ICar } from "../../store/car/types";
import { getMyCars } from "../../store/car/handlers";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { IMetaData } from "../../store/rental/types";
import { formatPrice } from "../../utils";
import CreateCarModal from "../../components/modals/CreateCarModal";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyCars = () => {
    const { t } = useTranslation()
    const [cars, setCars] = useState<ICar[]>([]);
    const [meta, setMeta] = useState({} as IMetaData);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({
        sortDescending: "true",
        page: "0",
        size: "10",
        status: "",
        searchQuery: "",
    })
    const handleChangeStatus = (e: CheckboxChangeEvent) => {
        setParams({ ...params, status: e.target.value });
    }
    const handleChangeSort = (value: string) => {
        setParams({ ...params, sortDescending: value === 'DESC' ? 'true' : 'false' });
    }
    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setParams({ ...params, searchQuery: e.target.value });
    }
    const options = [
        { label: t("common.all"), value: '' },
        { label: t("common.waitAccept"), value: 'PENDING' },
        { label: t("common.Accepted"), value: 'APPROVED' },
    ]

    useMemo(() => {
        async function fetchData() {
            setLoading(true);
            const response = await getMyCars(params);
            if (response?.success) {
                setCars(response?.data);
                setMeta(response?.meta ?? {} as IMetaData);
            }
            setLoading(false);
        }
        fetchData();
    }, [params])
    const columns: ColumnsType<ICar> = [
        {
            title: 'STT',
            key: 'id',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("car.name"),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t("car.status"),
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'AVAILABLE' ? 'green' : 'red';
                return <Tag color={color}>{status}</Tag>
            }
        },
        {
            title: t("car.color"),
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => <ColorPicker value={color} disabled />
        },
        {
            title: t("car.transmission"),
            dataIndex: 'transmission',
            key: 'transmission',
            render: (transmission: string) => transmission === 'MANUAL' ? 'Số sàn' : 'Tự động'
        },
        // {
        //     title: 'Số ghế',
        //     dataIndex: 'seat',
        //     key: 'seat',
        // },
        // {
        //     title: 'Nhiên liệu',
        //     dataIndex: 'fuel',
        //     key: 'fuel',
        //     render: (fuel: string) => fuel === 'GASOLINE' ? 'Xăng' : 'Dầu'
        // },
        // {
        //     title: 'Mức tiêu thụ',
        //     dataIndex: 'fuel_consumption',
        //     key: 'fuel_consumption',
        //     render: (fuel_consumption: number) => `${fuel_consumption} lít / 100km`
        // },
        {
            title: t("car.license_plate"),
            dataIndex: 'license_plate',
            key: 'license_plate',
        },
        {
            title: t("car.daily_rate"),
            dataIndex: 'daily_rate',
            key: 'daily_rate',
            render: (daily_rate: number) => `${formatPrice(daily_rate)} VNĐ / ${t("common.day")}`
        },
        {
            title: t("common.action"),
            key: 'action',
            render: (value) => (
                <Space>
                    <Link to={`/account/my-cars/${value?.id}`}>{t("common.viewDetail")}</Link>
                </Space>
            ),
        },

    ]
    const debounceSearch = debounce(handleChangeSearch, 300);
    return (
        <div className="p-4 bg-lite">
            <Spin spinning={loading}>
                <Typography.Title level={3}>{t("account.my_cars.list")}</Typography.Title>
                <Row>
                    <Col span={24}>
                        <Flex align="center" justify="space-between">
                            <Radio.Group buttonStyle="solid" options={options} value={params?.status} optionType="button" onChange={handleChangeStatus} />
                            <Space>
                                <Select
                                    value={params.sortDescending === 'true' ? 'DESC' : 'ASC'}
                                    className="w-[120px]"
                                    onChange={handleChangeSort}
                                    options={[
                                        { value: 'ASC', label: t("common.ASC") },
                                        { value: 'DESC', label: t("common.DESC") },
                                    ]}
                                />
                                <Search placeholder={t("account.my_cars.find_by_name")} onChange={debounceSearch} className="w-[300px]" allowClear />
                            </Space>
                        </Flex>
                    </Col>
                    <Divider></Divider>
                    <Col span={24}>
                        <Button type="dashed" icon={<PlusCircleOutlined />} className="w-full" onClick={() => setOpenCreateModal(true)}>{t("account.my_cars.add_new")}</Button>
                        <Table
                            className="w-full"
                            columns={columns}
                            dataSource={cars}
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                pageSize: Number(params.size),
                                total: meta.item_count,
                                current: Number(params.page) + 1,
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            onChange={(pagination: TablePaginationConfig) => {
                                setParams({
                                    ...params,
                                    page: String((pagination?.current ?? 1) - 1),
                                    size: String(pagination?.pageSize),
                                });
                            }}
                        ></Table>
                    </Col>
                </Row>
                <Modal
                    destroyOnClose={true}
                    title={t("account.my_cars.add_new")}
                    open={openCreateModal}
                    footer={false}
                    onCancel={() => setOpenCreateModal(false)}
                    width={1000}
                    maskClosable={false}
                >
                    <CreateCarModal params={params} setParams={setParams} setOpen={setOpenCreateModal}></CreateCarModal>
                </Modal>
            </Spin>
        </div>
    );
};

export default MyCars;