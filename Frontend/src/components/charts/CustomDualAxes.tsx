import { DualAxes } from '@ant-design/plots';
import { IRentalContractSummary } from '../../store/stats/types';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';

const CustomDualAxes = ({ data, title, type = "LESSOR" }: {
    data: IRentalContractSummary[]
    title: string
    type?: string
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
                    if (v === 'total_value') return 'rect';
                    return 'smooth';
                },
                itemLabelText: (v: { color: string, id: string, label: string }) => {
                    if (v.label === 'total_value') return t(`${type === 'LESSOR' ? 'stat.revenue' : 'stat.fee'}`);
                    return t('stat.contract');
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
                    return v <= 1000 ? v : numeral(v).format('0,0') + ' đ';
                },
            }
        },
        tooltip: {
            items: [
                {
                    field: 'total_value',
                    name: t(`${type === 'LESSOR' ? 'stat.revenue' : 'stat.fee'}`),
                    channel: { y: 'total_value' },
                    valueFormatter: (v: number) => numeral(v).format('0,0') + ' đ',
                    color: '#4096ff',
                },
                {
                    field: 'total_contracts',
                    name: t('stat.contract'),
                    channel: { y: 'total_contracts' },
                    valueFormatter: (v: number) => v,
                    color: '#fdae6b',
                },
            ]
        },
        children: [
            {
                type: 'interval',
                yField: 'total_value',
            },
            {
                type: 'line',
                yField: 'total_contracts',
                shapeField: 'smooth',
                scale: { color: { relations: [['total_contracts', '#fdae6b']] } },
                axis: { y: { position: 'right' } },
                style: { lineWidth: 2 },
            },
        ],
    };
    return <DualAxes {...config} />;
};

export default CustomDualAxes;