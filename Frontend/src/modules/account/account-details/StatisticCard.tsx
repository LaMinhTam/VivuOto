import { Button, Col, DatePicker, Divider, Empty, Flex, Row, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchRentalContractSummary } from '../../../store/stats/handlers';
import { ContractParamsType, IRentalContractSummary } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMM, formatDateToDDMMYYYY, getDateRange } from '../../../utils/helper';
import CustomDualAxes from '../../../components/charts/CustomDualAxes';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx-js-style';
import { getUserInfoFromCookie } from '../../../utils';

const { RangePicker } = DatePicker;

const StatisticCard = ({ params, setParams, type }: {
    params: ContractParamsType,
    setParams: (params: ContractParamsType) => void
    type: string
}) => {
    const userInfo = getUserInfoFromCookie();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [rentalContractSummary, setRentalContractSummary] = useState<IRentalContractSummary[]>([] as IRentalContractSummary[]);
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
        const response = await fetchRentalContractSummary(params);
        if (response?.success) {
            const newData = response?.data?.map((item: IRentalContractSummary) => {
                return {
                    ...item,
                    day_label: formatDateToDDMM(item?.day_label),
                };
            });
            setRentalContractSummary(newData);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const headers = {
            day_label: t('excel.dayLabel'),
            status: t('excel.status'),
            total_contracts: t('excel.totalContracts'),
            total_amount: t('excel.totalAmount'),
        };

        // Get sheet title based on type
        const sheetTitle = t(`excel.${type === 'LESSOR' ? 'lessorRentalContractSummary' : 'lesseeRentalContractSummary'}`);

        // Create empty worksheet first
        const worksheet = XLSX.utils.aoa_to_sheet([]);

        // Add main table title and headers
        XLSX.utils.sheet_add_aoa(worksheet, [
            [sheetTitle],
            Object.values(headers)
        ], { origin: "A1" });

        // Add data starting from row 3
        XLSX.utils.sheet_add_json(worksheet, rentalContractSummary, {
            origin: "A3",
            skipHeader: true
        });

        const exportTime = new Date();

        // Export info table data
        const exportInfo = [
            [t('excel.exportInfo')], // Title
            [t('excel.exportedBy'), userInfo?.display_name || 'N/A'],
            [t('excel.exportTime'), formatDateToDDMMYYYY(exportTime) + ' ' + exportTime.toLocaleTimeString()]
        ];

        // Calculate export info position
        const mainTableLastCol = Object.keys(headers).length - 1;
        const exportInfoStartCol = mainTableLastCol + 2;

        // Add export info to worksheet
        XLSX.utils.sheet_add_aoa(worksheet, exportInfo, {
            origin: XLSX.utils.encode_cell({ r: 0, c: exportInfoStartCol })
        });

        // Merge cells for titles
        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: mainTableLastCol } },
            { s: { r: 0, c: exportInfoStartCol }, e: { r: 0, c: exportInfoStartCol + 1 } }
        ];

        // Define styles
        const titleStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        const dataStyle = {
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        const exportInfoStyle = {
            ...dataStyle,
            alignment: { horizontal: "left", vertical: "center" }
        };

        // Helper function to safely set cell style
        const setCellStyle = (cell: string, style: any) => {
            if (!worksheet[cell]) {
                worksheet[cell] = { v: "", t: "s" };
            }
            worksheet[cell].s = style;
        };

        // Apply styles to main table title
        for (let C = 0; C <= mainTableLastCol; C++) {
            setCellStyle(XLSX.utils.encode_cell({ r: 0, c: C }), titleStyle);
        }

        // Apply styles to headers
        for (let C = 0; C <= mainTableLastCol; C++) {
            setCellStyle(XLSX.utils.encode_cell({ r: 1, c: C }), titleStyle);
        }

        // Apply styles to data cells
        const dataRange = XLSX.utils.decode_range(worksheet['!ref']!);
        for (let R = 2; R <= dataRange.e.r; R++) {
            for (let C = 0; C <= mainTableLastCol; C++) {
                setCellStyle(XLSX.utils.encode_cell({ r: R, c: C }), dataStyle);
            }
        }

        // Apply styles to export info
        setCellStyle(XLSX.utils.encode_cell({ r: 0, c: exportInfoStartCol }), titleStyle);
        setCellStyle(XLSX.utils.encode_cell({ r: 0, c: exportInfoStartCol + 1 }), titleStyle);

        for (let R = 1; R <= 2; R++) {
            for (let C = exportInfoStartCol; C <= exportInfoStartCol + 1; C++) {
                setCellStyle(XLSX.utils.encode_cell({ r: R, c: C }), exportInfoStyle);
            }
        }

        // Set column widths
        const mainTableColWidth = Math.max(...Object.values(headers).map(h => h.length), 15);
        const exportInfoColWidth = 25;
        worksheet["!cols"] = [
            ...Array(mainTableLastCol + 1).fill({ wch: mainTableColWidth }),
            { wch: 5 },
            { wch: exportInfoColWidth },
            { wch: exportInfoColWidth }
        ];

        // Set row heights
        worksheet['!rows'] = [{ hpt: 30 }, { hpt: 25 }];

        // Create and save workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

        const fileName = `${t('excel.rentalContractSummaryFile')}_${t(`common.${type.toLowerCase()}`)}_${formatDateToDDMMYYYY(new Date())}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };


    useMemo(() => {
        fetchUserContractSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Flex align='center' justify='space-between'>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={exportToExcel}
                        disabled={rentalContractSummary.length === 0}
                    >
                        {t('common.exportToExcel')}
                    </Button>
                    <Flex>
                        {["date", "week", "month", "year"].map((item, index) => (
                            <Button key={index} type="link" onClick={() => handleRangeChange(item as 'date' | 'week' | 'month' | 'year')}>{t(`common.${item}`)}</Button>
                        ))}
                    </Flex>
                    <RangePicker value={rangePickerDates} onChange={handleChangeDate} placeholder={[t('common.fromDate'), t('common.toDate')]} />
                </Flex>
            </Col>
            <Divider className='m-0'></Divider>
            <Col span={24}>
                <Spin spinning={loading}>
                    {rentalContractSummary.length > 0 ? <CustomDualAxes data={rentalContractSummary} title={t(`${type === 'LESSOR' ? 'stat.lessor.revenueContractTitle' : 'stat.lessee.feeContractTitle'}`)} type={type} /> : <Empty></Empty>}
                </Spin>
            </Col>
        </Row>
    );
};

export default StatisticCard;