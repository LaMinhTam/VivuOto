import { Button, Input, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

const VerifyCodeModal = ({ handleVerifyCode, loading }: { handleVerifyCode: () => void, loading: boolean }) => {
    const { t } = useTranslation()
    return (
        <Row>
            <Typography.Text type="secondary" className="mb-5">{t("verify_code.desc")}</Typography.Text>
            <Input
                type="number"
                placeholder={t("verify_code.input")}
                size="large"
                style={{ marginBottom: 20 }}
                required
            />
            <Button type="primary" size="large" block onClick={handleVerifyCode} loading={loading}>
                {t("verify_code.submit")}
            </Button>
        </Row>
    );
};

export default VerifyCodeModal;