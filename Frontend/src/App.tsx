
import { ConfigProvider } from "antd";
import "./App.scss";
import enUS from "antd/es/locale/en_US";
import viVN from "antd/es/locale/vi_VN";
import { useTranslation } from "react-i18next";
import 'jodit'

const App = ({ children }: {
  children: React.ReactNode;
}) => {
  const { i18n } = useTranslation();
  return (
    <ConfigProvider locale={
      i18n.language === "en" ? enUS : viVN
    }>
      {children}
    </ConfigProvider>
  );
};

export default App;