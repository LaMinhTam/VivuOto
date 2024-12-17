import { Button, Col, DatePicker, Divider, Empty, Flex, Radio, RadioChangeEvent, Row, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchStatisticInvoice } from '../../../store/stats/handlers';
import { InvoiceSummaryParamsType, IStatisticInvoice } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMM, formatDateToDDMMYYYY, formatDateToDDMMYYYYHHMMSS, getDateRange } from '../../../utils/helper';
import InvoiceDualAxes from '../../../components/charts/InvoiceDualAxes';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx-js-style';
import { getUserInfoFromCookie } from '../../../utils';

const { RangePicker } = DatePicker;


const InvoiceStatisticCard = ({ params, setParams }: {
    params: InvoiceSummaryParamsType,
    setParams: (params: InvoiceSummaryParamsType) => void
}) => {
    const userInfo = getUserInfoFromCookie();
    const { t } = useTranslation();
    const Options = [
        { label: t('stat.admin.RENT'), value: 'RENT' },
        { label: t('stat.admin.TOKEN'), value: 'TOKEN' }
    ]
    const [loading, setLoading] = useState(false);
    const [invoiceSummary, setInvoiceSummary] = useState<IStatisticInvoice[]>([] as IStatisticInvoice[]);
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
            type: e.target.value
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

    const fetchInvoiceSummary = async () => {
        setLoading(true);
        const response = await fetchStatisticInvoice(params);
        if (response?.success) {
            const newData = response?.data?.map((item: IStatisticInvoice) => {
                return {
                    ...item,
                    day_label: formatDateToDDMM(item?.day_label),
                };
            });
            setInvoiceSummary(newData);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const headers = {
            day_label: t('excel.dayLabel'),
            type: t('excel.invoice_type'),
            total_invoices: t('excel.totalInvoices'),
            total_amount: t('excel.totalAmount'),
        };

        const sheetTitle = t(`excel.invoiceStatTitle`);

        // Create empty worksheet first
        const worksheet = XLSX.utils.aoa_to_sheet([]);

        // Add main table title and headers
        XLSX.utils.sheet_add_aoa(worksheet, [
            [sheetTitle],
            Object.values(headers)
        ], { origin: "A1" });

        // Add data starting from row 3
        XLSX.utils.sheet_add_json(worksheet, invoiceSummary, {
            origin: "A3",
            skipHeader: true
        });

        const exportTime = new Date();

        // Export info table data
        const exportInfo = [
            [t('excel.exportInfo')],
            [t('excel.exportedBy'), userInfo?.display_name || 'N/A'],
            [t('excel.exportTime'), formatDateToDDMMYYYYHHMMSS(exportTime)]
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

        // Apply styles to main table title and headers
        for (let C = 0; C <= mainTableLastCol; C++) {
            setCellStyle(XLSX.utils.encode_cell({ r: 0, c: C }), titleStyle);
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

        const fileName = `${t('excel.invoiceSummaryFile')}_admin_${formatDateToDDMMYYYYHHMMSS(new Date())}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    useMemo(() => {
        fetchInvoiceSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Flex align='center' justify='space-between'>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={exportToExcel}
                        disabled={invoiceSummary.length === 0}
                    >
                        {t('common.exportToExcel')}
                    </Button>
                    <Flex>
                        <Radio.Group buttonStyle="solid" options={Options} value={params?.type} optionType="button" onChange={handleChangeStatus} />
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
                    {invoiceSummary.length > 0 ? <InvoiceDualAxes data={invoiceSummary} title={t('stat.admin.transactionTitle')} /> : <Empty></Empty>}
                </Spin>
            </Col>
        </Row>
    );
};

export default InvoiceStatisticCard;