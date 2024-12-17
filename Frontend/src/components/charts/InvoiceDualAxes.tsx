import { DualAxes } from '@ant-design/plots';
import { IStatisticInvoice } from '../../store/stats/types';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';

const InvoiceDualAxes = ({ data, title }: {
    data: IStatisticInvoice[]
    title: string
}) => {
    const { t } = useTranslation();
    const config = {
        xField: 'day_label',
        title,
        data,
        legend: {
            color: {
                title: true,
                position: 'top',
                itemMarker: (v: string) => {
                    if (v === 'total_amount') return 'rect';
                    return 'smooth';
                },
                itemLabelText: (v: { color: string, id: string, label: string }) => {
                    if (v.label === 'total_amount') return t(`stat.totalAmount`);
                    return t('stat.totalTransaction');
                },
                layout: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                },
            }
        },
        scrollbar: {
            x: {}
        },
        axis: {
            y: {
                labelFormatter: (v: number) => {
                    return v <= 1000 ? numeral(v).format('0') : numeral(v).format('0,0') + ' đ';
                },
            }
        },
        tooltip: {
            items: [
                {
                    field: 'total_amount',
                    name: t(`stat.totalAmount`),
                    channel: { y: 'total_amount' },
                    valueFormatter: (v: number) => numeral(v).format('0,0') + ' đ',
                    color: '#4096ff',
                },
                {
                    field: 'total_invoices',
                    name: t('stat.totalTransaction'),
                    channel: { y: 'total_invoices' },
                    valueFormatter: (v: number) => v,
                    color: '#fdae6b',
                },
            ]
        },
        children: [
            {
                type: 'interval',
                yField: 'total_amount',
            },
            {
                type: 'line',
                yField: 'total_invoices',
                shapeField: 'smooth',
                scale: { color: { relations: [['total_invoices', '#fdae6b']] } },
                axis: { y: { position: 'right' } },
                style: { lineWidth: 2 },
            },
        ],
    };
    return <DualAxes {...config} />;
};

export default InvoiceDualAxes;