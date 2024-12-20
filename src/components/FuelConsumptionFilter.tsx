import React from "react";
import { useTranslation } from "react-i18next";

interface FuelConsumptionFilterProps {
  minConsumption: number;
  maxConsumption: number;
  onConsumptionChange: (min: number, max: number) => void;
}

const FuelConsumptionFilter: React.FC<FuelConsumptionFilterProps> = ({
  minConsumption,
  maxConsumption,
  onConsumptionChange,
}) => {
  const { t } = useTranslation();

  const handleMinConsumptionChange = (value: number) => {
    onConsumptionChange(value, maxConsumption);
  };

  const handleMaxConsumptionChange = (value: number) => {
    onConsumptionChange(minConsumption, value);
  };

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-semibold">{t("car.fuel_consumption")}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minConsumption}
            onChange={(e) => handleMinConsumptionChange(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
          />
          <span className="mx-2">-</span>
          <input
            type="number"
            value={maxConsumption}
            onChange={(e) => handleMaxConsumptionChange(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default FuelConsumptionFilter;
