import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors';
import { Col, ColorPicker, Divider, Row, theme } from 'antd';
import type { ColorPickerProps } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';
import { useState } from 'react';

type Presets = Required<ColorPickerProps>['presets'][number];

// Generate preset color palettes
const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map<Presets>(([label, colors]) => ({
        label,
        colors,
    }));

interface CustomColorPickerProps {
    value?: string;
    onChange?: (hex: string) => void;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ value = '#1677ff', onChange }) => {
    const { token } = theme.useToken();
    const [color, setColor] = useState(value);

    const presets = genPresets({
        primary: generate(token.colorPrimary),
        red,
        green,
        cyan,
    });

    const handleColorChange = (_: AggregationColor, hex: string) => {
        setColor(hex);
        if (onChange) {
            onChange(hex);
        }
    };

    const customPanelRender: ColorPickerProps['panelRender'] = (
        _,
        { components: { Picker, Presets } },
    ) => (
        <Row justify="space-between" wrap={false}>
            <Col span={12}>
                <Presets />
            </Col>
            <Divider type="vertical" style={{ height: 'auto' }} />
            <Col flex="auto">
                <Picker />
            </Col>
        </Row>
    );

    return (
        <ColorPicker
            value={color}
            onChange={handleColorChange}
            presets={presets}
            panelRender={customPanelRender}
            size="middle"
            styles={{ popupOverlayInner: { width: 480 } }}
        />
    );
};

export default CustomColorPicker;
