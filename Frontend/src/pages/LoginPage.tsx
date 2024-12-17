import { useTranslation } from "react-i18next";
import { Button, Col, Flex, Form, FormProps, Input, Modal, Row, Typography } from "antd";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccessToken, saveUserInfoToCookie } from "../utils";
import { login } from "../store/auth/handlers";
import { AxiosResponse } from "axios";
import { IUser } from "../store/auth/types";
import { axiosPrivate } from "../apis/axios";
import { useAuth } from "../contexts/auth-context";
import { ENDPOINTS } from "../store/profile/models";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import { Helmet } from "react-helmet";
type FieldType = {
  email: string;
  password: string;
};


interface IMeResponse {
  code: number;
  message: string;
  data: IUser;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setIsLogged } = useAuth();
  const accessToken = getAccessToken();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    const res = await login(values.email, values.password);
    if (res?.success) {
      const meResponse: AxiosResponse<IMeResponse> =
        await axiosPrivate.get(ENDPOINTS.GET_ME);
      if (meResponse.data.code === 200) {
        saveUserInfoToCookie(meResponse.data.data, res?.token ?? "");
      }
      setLoading(false);
      toast.success(t("login.success"));
      setIsLogged(true);
      navigate("/");
    } else {
      setLoading(false);
      toast.error(t(`msg.${res?.message ?? "SYSTEM_MAINTENANCE"}`));
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate])

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <LayoutAuthentication>
      <Helmet>
        <title>Đăng nhập | ViVuOto - Nền tảng cho thuê xe tự lái</title>
        <meta name="description" content="Đăng nhập vào ViVuOto để trải nghiệm dịch vụ thuê xe tự lái với thủ tục đơn giản, nhanh chóng và an toàn." />
        <meta name="keywords" content="đăng nhập vivuoto, thuê xe tự lái, cho thuê xe, vivuoto login" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Đăng nhập | ViVuOto - Nền tảng cho thuê xe tự lái" />
        <meta property="og:description" content="Đăng nhập vào ViVuOto để trải nghiệm dịch vụ thuê xe tự lái với thủ tục đơn giản, nhanh chóng và an toàn." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vivuoto-rental.vercel.app/signin" />
        <meta property="og:image" content="https://vivuoto-rental.vercel.app/bg-authen.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vivuoto-rental.vercel.app/signin" />
      </Helmet>
      <Row className="h-full">
        <Col xs={24} md={12} lg={18} xl={18} className="h-full">
          <img
            src="./bg-authen.jpg"
            alt="Login"
            className="w-full h-full"
          />
        </Col>
        <Col xs={24} md={12} lg={6} xl={6}>
          <Flex align="center" justify="center" vertical className="w-full h-full">
            <Form
              form={form}
              name="login-form"
              layout="vertical"
              labelCol={{ span: 16 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="bg-lite w-full max-w-[400px] p-4 h-auto my-auto"
            >
              <Typography.Title
                level={3}
                style={{
                  textAlign: "center",
                }}
              >
                {t("login")}
              </Typography.Title>
              <Form.Item<FieldType>
                label={t("email")}
                name="email"
                rules={[
                  {
                    required: true,
                    message: t("require"),
                  },
                  {
                    type: "email",
                    message: t("email.error.invalid"),
                  },
                ]}
              >
                <Input placeholder={t("email.placeholder")} />
              </Form.Item>
              <Form.Item<FieldType>
                label={t("password")}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("require"),
                  },
                  {
                    min: 8,
                    message: t("password.error.invalid"),
                  },
                ]}
              >
                <Input.Password placeholder={t("password.placeholder")} />
              </Form.Item>
              <Form.Item>
                <Flex align="center" justify="flex-end"><Button type="link" onClick={() => setForgotPasswordModalVisible(true)}>{t('password.forgot')}</Button></Flex>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  iconPosition={"end"}
                >
                  {t("login")}
                </Button>
              </Form.Item>
              <Typography.Paragraph
                style={{
                  textAlign: "center",
                }}
              >
                {t("auth.dontHaveAccount")}{" "}
                <Link to="/signup">
                  {t("register")}
                </Link>
              </Typography.Paragraph>
            </Form>
          </Flex>
        </Col>
      </Row>
      <Modal
        open={forgotPasswordModalVisible}
        onCancel={() => setForgotPasswordModalVisible(false)}
        onClose={() => setForgotPasswordModalVisible(false)}
        title={t("forgot_password.title")}
        footer={false}
        maskClosable={false}
        destroyOnClose={true}
      >
        <ForgotPasswordModal setOpen={setForgotPasswordModalVisible} />
      </Modal>
    </LayoutAuthentication >
  );
};

export default LoginPage;
