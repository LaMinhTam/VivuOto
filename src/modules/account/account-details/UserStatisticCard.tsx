import { Button, Col, DatePicker, Divider, Empty, Flex, Radio, RadioChangeEvent, Row, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserStatisticContract } from '../../../store/stats/handlers';
import { ContractUserParamsType, IUserContractSummary } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMMYYYY, getDateRange } from '../../../utils/helper';
import UserDualAxes from '../../../components/charts/UserDualAxes';

const { RangePicker } = DatePicker;


const UserStatisticCard = ({ params, setParams }: {
    params: ContractUserParamsType,
    setParams: (params: ContractUserParamsType) => void
}) => {
    const { t } = useTranslation();
    const Options = [
        { label: t('common.lessee'), value: "false" },
        { label: t('common.lessor'), value: "true" }
    ]
    const [loading, setLoading] = useState(false);
    const [userSummary, setUserSummary] = useState<IUserContractSummary[]>([] as IUserContractSummary[]);
    const [rangePickerDates, setRangePickerDates] = useState<[Dayjs, Dayjs]>(getDateRange('year'));

    const handleChangeDate = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            const [fromDate, toDate] = dates;
            setParams({
                ...params,
                startDate: fromDate ? formatDateToDDMMYYYY(fromDate.toDate()) : '',
                endDate: toDate ? formatDateToDDMMYYYY(toDate.toDate()) : '',
            });
            setRangePickerDates([fromDate, toDate]);
        }
    };

    const handleChangeStatus = (e: RadioChangeEvent) => {
        setParams({
            ...params,
            filterByLessor: e.target.value
        });
    };

    const handleRangeChange = (range: 'date' | 'week' | 'month' | 'year') => {
        const [startDate, endDate] = getDateRange(range);
        setParams({
            ...params,
            startDate: formatDateToDDMMYYYY(startDate.toDate()),
            endDate: formatDateToDDMMYYYY(endDate.toDate()),
        });
        setRangePickerDates([startDate, endDate]);
    };

    const fetchUserContractSummary = async () => {
        setLoading(true);
        const response = await fetchUserStatisticContract(params);
        if (response?.success) {
            setUserSummary(response?.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useMemo(() => {
        fetchUserContractSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <Spin spinning={loading}>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align='center' justify='flex-end'>
                        <Flex>
                            <Radio.Group buttonStyle="solid" options={Options} value={params?.filterByLessor} optionType="button" onChange={handleChangeStatus} />
                            {["date", "week", "month", "year"].map((item, index) => (
                                <Button key={index} type="link" onClick={() => handleRangeChange(item as 'date' | 'week' | 'month' | 'year')}>{t(`common.${item}`)}</Button>
                            ))}
                        </Flex>
                        <RangePicker value={rangePickerDates} onChange={handleChangeDate} placeholder={[t('common.fromDate'), t('common.toDate')]} />
                    </Flex>
                </Col>
                <Divider className='m-0'></Divider>
                <Col span={24}>
                    {userSummary.length > 0 ? <UserDualAxes data={userSummary} title={t('stat.admin.userTitle')} /> : <Empty />}
                </Col>
            </Row>
        </Spin>
    );
};

export default UserStatisticCard;