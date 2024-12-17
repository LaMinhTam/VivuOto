
import React from 'react';
import PromoSection from '../modules/home/PromoSection';
import VehicleSection from '../modules/home/VehicleSection';
import LayoutMain from '../layouts/LayoutMain';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
    const { t } = useTranslation();
    return (
        <LayoutMain>
            <PromoSection />

            <VehicleSection
                title={t("common.popular")}
                type="popular"
            />

            <VehicleSection
                title={t("common.recommendation")}
                type="recommend"
            />
        </LayoutMain>
    );
}
