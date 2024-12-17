import { Pie } from '@ant-design/plots';
import { ICarStatisticsByProvince } from '../../store/stats/types';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';

const CustomPieChart = ({ data, title }: { data: ICarStatisticsByProvince[], title: string }) => {
    const { t } = useTranslation();
    const config = {
        data,
        angleField: 'car_count',
        colorField: 'province',
        title,
        label: {
            text: 'car_count',
            style: {
                fontWeight: 'bold',
            },
        },
        tooltip: {
            title: (d: ICarStatisticsByProvince) => {
                return t('common.province') + ': ' + d.province
            },
            items: [
                {
                    field: 'car_count',
                    name: t('stat.admin.car_count'),
                    valueFormatter: (v: number) => numeral(v).format('0,0'),
                },
            ],
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };
    return <Pie {...config} />;
};

export default CustomPieChart;