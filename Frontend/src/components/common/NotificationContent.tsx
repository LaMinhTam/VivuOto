import { Avatar, Button, Divider, Empty, Flex, Popover, Skeleton, Typography } from "antd";
import { useAuth } from "../../contexts/auth-context";
import { formatDate, handleFormatLink } from "../../utils";
import { useTranslation } from "react-i18next";
import { DashOutlined } from "@ant-design/icons";
import { useMemo, useState, useEffect, useRef } from "react";
import { NotificationParams } from "../../store/auth/models";
import { getListNotifications, handleMakeNotificationAsRead } from "../../store/auth/handlers";
import { INotificationParams } from "../../store/auth/types";
import { Link } from "react-router-dom";

const NotificationContent = () => {
    const { notifications, setNotifications } = useAuth();
    const [loading, setLoading] = useState(false);
    const [makeAsReadLoading, setMakeAsReadLoading] = useState(false);
    const [params, setParams] = useState<INotificationParams>({
        ...NotificationParams
    });
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handleFetchNotifications = async () => {
        setLoading(true);
        const response = await getListNotifications(params);
        if (response?.success && response.data && response.meta) {
            const { data, meta } = response;
            setNotifications({
                data,
                meta
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const handleMakeMessageAsRead = async (id: string) => {
        setMakeAsReadLoading(true);
        const response = await handleMakeNotificationAsRead(id);
        if (response?.success) {
            const newNotifications = notifications?.data.map(item => {
                if (item.id === id) {
                    return response.data;
                }
                return item;
            });
            setNotifications({
                data: newNotifications,
                meta: notifications?.meta
            });
            setMakeAsReadLoading(false);
        } else {
            setMakeAsReadLoading(false);
        }
    }

    useMemo(() => {
        handleFetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && notifications?.meta?.has_next_page) {
                setParams(prev => ({ ...prev, size: prev.size + 10 }));
            }
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [notifications]);

    const { t } = useTranslation();

    return (
        <div className="w-[432px] h-auto max-h-[445px] overflow-auto">
            <Divider className="my-2"></Divider>
            {notifications?.meta?.item_count > 0 ? notifications?.data.map((item) => (
                <div className={`flex items-center justify-between px-4 py-2 ${item?.read ? '' : 'bg-text7 bg-opacity-20'}`} key={item.id}>
                    <Link to={`account/${handleFormatLink(item?.message, item.target_id)}`} onClick={() => handleMakeMessageAsRead(item.id)}>
                        <Flex align="start" gap={8}>
                            <Avatar src={"/VivuOto_logo.png"} alt="avatar" className="w-[56px] h-[56px] object-cover"></Avatar>
                            <div className="flex flex-col">
                                <Typography.Title level={5} style={{ marginBottom: 4 }}>VivuOto</Typography.Title>
                                <Typography.Text>{t(`msg.${item.message}`)}</Typography.Text>
                                <Typography.Text className="font-medium text-custom-blue">{formatDate(item?.created_at)}</Typography.Text>
                            </div>
                        </Flex>
                    </Link>
                    <Popover
                        placement="rightTop"
                        trigger={["click"]}
                        content={
                            <Flex vertical>
                                <Button loading={makeAsReadLoading} type="text" onClick={() => handleMakeMessageAsRead(item.id)}>{t("common.markAsRead")}</Button>
                                <Button type="text" danger>{t("common.delete")}</Button>
                            </Flex>
                        }
                    >
                        <Button icon={<DashOutlined />} type="text"></Button>
                    </Popover>
                </div>
            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>}
            {loading && (
                <div className="px-4 py-2">
                    <Skeleton avatar paragraph={{ rows: 2 }} active />
                </div>
            )}
            <div ref={loadMoreRef}></div>
        </div>
    );
};

export default NotificationContent;