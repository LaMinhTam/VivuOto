import { DualAxes } from '@ant-design/plots';
import { ICarStatistics } from '../../store/stats/types';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';

const CarDualAxes = ({ data, title }: {
    data: ICarStatistics[]
    title: string
}) => {
    const { t } = useTranslation();
    const config = {
        xField: 'car_name',
        title,
        data,
        legend: {
            color: {
                title: true,
                position: 'top',
                itemMarker: (v: string) => {
                    if (v === 'total_rental_value') return 'rect';
                    return 'smooth';
                },
                itemLabelText: (v: { color: string, id: string, label: string }) => {
                    if (v.label === 'total_rental_value') return t('stat.revenue');
                    return t('stat.contract');
                },
                layout: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                },
            }
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
                    field: 'total_rental_value',
                    name: t(`stat.revenue`),
                    channel: { y: 'total_rental_value' },
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
                yField: 'total_rental_value',
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

export default CarDualAxes;