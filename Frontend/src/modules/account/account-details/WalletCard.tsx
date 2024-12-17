import { PlusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const WalletCard = ({ loading, handleDepositToken, handleCheckSyncWallet, metamaskInfo }: {
    loading: boolean,
    handleDepositToken: () => Promise<void>,
    handleCheckSyncWallet: () => Promise<void>
    metamaskInfo: {
        account: string,
        balance: string
    }
}) => {
    const { t } = useTranslation();
    return (
        <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Flex gap={4}>
                            <Typography.Title level={3}>{t("account.my_account.my_wallet")}</Typography.Title>
                        </Flex>
                        <Flex gap={4}>
                            <Button type="dashed" icon={<SyncOutlined />} loading={loading} onClick={handleCheckSyncWallet}>{t("account.my_account.check_sync")}</Button>
                            <Button type="primary" icon={<PlusCircleOutlined />} loading={loading} onClick={handleDepositToken}>{t("account.my_account.deposit_token")}</Button>
                        </Flex>
                    </Flex>
                </Col>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Typography.Text>{t("account.my_account.my_wallet.address")}</Typography.Text>
                        <Typography.Text>{metamaskInfo?.account}</Typography.Text>
                    </Flex>
                    <Divider></Divider>
                    <Flex align="center" justify="space-between">
                        <Typography.Text>{t("account.my_account.my_wallet.balance")}</Typography.Text>
                        <Typography.Text>{metamaskInfo?.balance}</Typography.Text>
                    </Flex>
                </Col>
            </Row>
        </Col>
    );
};

export default WalletCard;