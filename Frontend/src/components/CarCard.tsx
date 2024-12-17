import React from "react";
import capacityIcon from "../assets/capacity.png";
import gasStationIcon from "../assets/gas-station.png";
import transmissionIcon from "../assets/transmission.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "../config/apiConfig";
import { ICar } from "../store/car/types";
import { useAuth } from "../contexts/auth-context";
import { toast } from "react-toastify";

interface CarCardProps {
  car: ICar;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLogged } = useAuth();
  const handleRentNow = () => {
    if (isLogged) {
      localStorage.setItem("STORAGE_RENT_CAR_ID", car.id);
      navigate("/checkout");
    } else {
      toast.warning(t("msg.REQUIRE_AUTHENTICATION_FEATURE"))
    }
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md">
      <img
        src={car?.image_url?.[0] || DEFAULT_AVATAR}
        alt="Car"
        className="object-cover w-full h-64 cursor-pointer"
        onClick={() => navigate(`/car/${car.id}`)}
      />
      <div className="p-4">
        <h2 className="mb-2 text-lg font-bold cursor-pointer line-clamp-1" onClick={() => navigate(`/car/${car.id}`)}>{car.name}</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center mr-4">
            <img
              src={gasStationIcon}
              alt={t("car.fuel_consumption")}
              className="w-6 h-6 mr-2"
            />
            <span className="text-filter-range">
              {car.fuel_consumption} {t("common.litersPer100km")}
            </span>
          </div>
          <div className="flex items-center mr-4">
            <img
              src={transmissionIcon}
              alt={t("car.transmission")}
              className="w-6 h-6 mr-2"
            />
            <span className="text-filter-range">
              {car.transmission === "MANUAL" ? t("car.manual") : t("car.automatic")}
            </span>
          </div>
          <div className="flex items-center">
            <img
              src={capacityIcon}
              alt={t("car.seat")}
              className="w-6 h-6 mr-2"
            />
            <span className="text-filter-range">{car.seat}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <span className="font-bold text-primary-default">
            {car?.daily_rate?.toLocaleString()} {t("common.currency")} /{" "}
            <span className="text-filter-range">{t("common.day")}</span>
          </span>
          <button className="px-4 py-2 text-white rounded bg-primary-default hover:bg-primary-dark" onClick={handleRentNow}>
            {t("common.rentNow")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;