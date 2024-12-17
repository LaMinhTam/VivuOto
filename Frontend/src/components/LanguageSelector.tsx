import React from "react";
import { Menu, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import ukFlag from "../assets/united-kingdom.png";
import vnFlag from "../assets/vietnam.png";
import { GlobalOutlined } from "@ant-design/icons";

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      localStorage.setItem("STORAGE_LANGUAGE", lng);
      window.location.reload();
    });
  };

  const languageMenu = (
    <Menu
      style={{
        padding: 0
      }}
    >
      <Menu.Item
        key="en"
        onClick={() => handleLanguageChange("en")}
        className={`${i18n.language === "en" ? "bg-quaternary" : ""}`}
        style={{
          color: i18n.language === "en" ? "#1677ff" : "#000",
        }}
      >
        <img src={ukFlag} alt="English" className="inline-block w-6 h-6 mr-2" />
        {t("common.english")}
      </Menu.Item>
      <Menu.Item
        key="vi"
        onClick={() => handleLanguageChange("vi")}
        className={`${i18n.language === "vi" ? "bg-quaternary" : ""}`}
        style={{
          color: i18n.language === "vi" ? "#1677ff" : "#000",
        }}
      >
        <img
          src={vnFlag}
          alt="Vietnamese"
          className="inline-block w-6 h-6 mr-2"
        />
        {t("common.vietnamese")}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={languageMenu} trigger={["click"]}>
      <div className="p-2 cursor-pointer">
        <GlobalOutlined className="text-xl" />
      </div>
    </Dropdown>
  );
};

export default LanguageSelector;