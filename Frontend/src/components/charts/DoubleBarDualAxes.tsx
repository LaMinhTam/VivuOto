import { DualAxes } from '@ant-design/plots';
import { IRentalVolume } from '../../store/stats/types';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';

const DoubleBarDualAxes = ({ data, title }: {
    data: IRentalVolume[],
    title: string
}) => {
    const { t } = useTranslation();
    const newData = data.map((item) => {
        return {
            ...item,
            total_rented_cars: item.total_rented_cars * 20
        }
    });
    // const exData = [
    //     {
    //         "year_month": "2024-10-03",
    //         "total_contracts": 1,
    //         "total_free_cars": 440,
    //         "total_rented_cars": 200,
    //         "total_income": 486144.0
    //     },
    //     {
    //         "year_month": "2024-10-04",
    //         "total_contracts": 2,
    //         "total_free_cars": 440,
    //         "total_rented_cars": 100,
    //         "total_income": 892680.0
    //     },
    //     {
    //         "year_month": "2024-10-11",
    //         "total_contracts": 1,
    //         "total_free_cars": 439,
    //         "total_rented_cars": 400,
    //         "total_income": 466536.0
    //     },
    //     {
    //         "year_month": "2024-10-18",
    //         "total_contracts": 1,
    //         "total_free_cars": 439,
    //         "total_rented_cars": 390,
    //         "total_income": 285000.0
    //     },
    //     {
    //         "year_month": "2024-10-25",
    //         "total_contracts": 2,
    //         "total_free_cars": 438,
    //         "total_rented_cars": 300,
    //         "total_income": 2001564.0
    //     }
    // ]
    const barData = newData.flatMap(item => [
        { year_month: item.year_month, value: item.total_free_cars, type: t('stat.volume.total_free_cars') },
        { year_month: item.year_month, value: item.total_rented_cars, type: t('stat.volume.total_rented_cars') }
    ]);

    const lineData = newData.map(item => ({
        year_month: item.year_month,
        type: t('stat.volume.total_income'),
        value: item.total_income
    }));

    const config = {
        xField: 'year_month',
        legend: {
            color: {
                title: true,
                position: 'top',
                itemMarker: (v: string) => {
                    if (v === t('stat.volume.total_free_cars')) return 'rect';
                    else if (v === t('stat.volume.total_rented_cars')) return 'circle';
                    return 'smooth';
                },
                layout: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                },
            }
        },
        title,
        scrollbar: {
            x: {}
        },
        // tooltip: {
        //     items: [
        //         {
        //             field: 'total_free_cars',
        //             name: t(`stat.volume.total_free_cars`),
        //             channel: { y: 'total_free_cars' },
        //             valueFormatter: (v: number) => v,
        //             color: '#4096ff',
        //         },
        //         {
        //             field: 'total_rented_cars',
        //             name: t('stat.volume.total_rented_cars'),
        //             channel: { y: 'total_rented_cars' },
        //             valueFormatter: (v: number) => v,
        //             color: '#0dcccc',
        //         },
        //         {
        //             field: 'total_income',
        //             name: t('stat.volume.total_income'),
        //             channel: { y: 'total_income' },
        //             valueFormatter: (v: number) => numeral(v).format('0,0') + ' đ',
        //             color: '#fdae6b',
        //         },
        //     ]
        // },
        tooltip: (d: { year_month: string, value: number, type: string }) => ({
            value: d.type === t('stat.volume.total_free_cars') || d.type === t('stat.volume.total_rented_cars') ? d.value : numeral(d.value).format('0,0') + ' đ',
        }),
        children: [
            {
                data: barData,
                type: 'interval',
                yField: 'value',
                colorField: 'type',
                group: true,
                style: { maxWidth: 80 },
                interaction: { elementHighlight: { background: true } },
            },
            {
                data: lineData,
                type: 'line',
                yField: 'value',
                colorField: 'type',
                style: { lineWidth: 2 },
                axis: { y: { position: 'right' } },
                interaction: {
                    tooltip: {
                        crosshairs: false,
                        marker: false,
                    },
                },
            },
        ],
        axis: {
            y: {
                labelFormatter: (v: number) => {
                    return v <= 1000 ? v : numeral(v).format('0,0') + ' đ';
                },
            }
        },
    };

    return <DualAxes {...config} />;
};

export default DoubleBarDualAxes;