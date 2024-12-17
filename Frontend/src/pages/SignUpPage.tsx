import { Button, Col, Flex, Form, FormProps, Input, Modal, Row, Spin, Typography } from "antd";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import VerifyCodeModal from "../components/modals/VerifyCodeModal";
import { register, verifyEmail } from "../store/auth/handlers";
import { toast } from "react-toastify";
import { IRegisterResponseData, IUser } from "../store/auth/types";
import { AxiosResponse } from "axios";
import { ENDPOINTS } from "../store/profile/models";
import { axiosPrivate } from "../apis/axios";
import { saveUserInfoToCookie } from "../utils";
import { useAuth } from "../contexts/auth-context";
import { Helmet } from "react-helmet";

type FieldType = {
  name: string;
  email: string;
  password: string;
};

interface IMeResponse {
  code: number;
  message: string;
  data: IUser;
}

const SignUpPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingVerifyCode, setLoadingVerifyCode] = useState(false);
  const [data, setData] = useState<IRegisterResponseData>({} as IRegisterResponseData)
  const [visibleVerifyCodeModal, setVisibleVerifyCodeModal] = useState(false);
  const navigate = useNavigate();
  const { setIsLogged } = useAuth();

  const onFinish = async (values: FieldType) => {
    setLoading(true)
    const response = await register(values.name, values.email, values.password)
    if (response?.success) {
      toast.success(t(`msg.${response.message}`));
      setData(response.data as IRegisterResponseData);
      setVisibleVerifyCodeModal(true);
      setLoading(false)
    } else {
      toast.error(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
      setLoading(false)
    }
  };

  const handleVerifyCode = async () => {
    setLoadingVerifyCode(true);
    const response = await verifyEmail(data.email, data.verification_code);
    if (response?.success) {
      toast.success(t(`msg.${response.message}`));
      setVisibleVerifyCodeModal(false);
      const meResponse: AxiosResponse<IMeResponse> =
        await axiosPrivate.get(ENDPOINTS.GET_ME);
      if (meResponse.data.code === 200) {
        saveUserInfoToCookie(meResponse.data.data, response?.data ?? "");
      }
      navigate("/");
      setLoadingVerifyCode(false);
      setIsLogged(true)
    } else {
      toast.error(t(`msg.${response?.message ?? 'SYSTEM_MAINTENANCE'}`));
      setLoadingVerifyCode(false);
    }
  }
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <LayoutAuthentication>
      <Helmet>
        <title>Đăng ký tài khoản | ViVuOto - Nền tảng cho thuê xe tự lái</title>
        <meta name="description" content="Đăng ký tài khoản ViVuOto để trải nghiệm dịch vụ thuê xe tự lái. Thủ tục đơn giản, xác thực nhanh chóng và bảo mật thông tin." />
        <meta name="keywords" content="đăng ký vivuoto, tạo tài khoản thuê xe, đăng ký thuê xe tự lái, vivuoto signup, cho thuê xe tự lái" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Đăng ký tài khoản | ViVuOto - Nền tảng cho thuê xe tự lái" />
        <meta property="og:description" content="Đăng ký tài khoản ViVuOto để trải nghiệm dịch vụ thuê xe tự lái. Thủ tục đơn giản, xác thực nhanh chóng và bảo mật thông tin." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vivuoto-rental.vercel.app/signup" />
        <meta property="og:image" content="https://vivuoto-rental.vercel.app/bg-authen.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vivuoto-rental.vercel.app/signup" />
      </Helmet>
      <Row className="h-full">
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
                {t("register")}
              </Typography.Title>
              <Form.Item<FieldType>
                label={t("name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("require"),
                  },
                ]}
              >
                <Input placeholder={t("name.placeholder")} />
              </Form.Item>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  iconPosition={"end"}
                >
                  {t("register")}
                </Button>
              </Form.Item>
              <Typography.Paragraph
                style={{
                  textAlign: "center",
                }}
              >
                {t("auth.alreadyHaveAccount")}{" "}
                <Link to="/signin">
                  {t("auth.signIn")}
                </Link>
              </Typography.Paragraph>
            </Form>
          </Flex>
        </Col>
        <Col xs={24} md={12} lg={18} xl={18} className="h-full">
          <img
            src="./bg-authen.jpg"
            alt="Login"
            className="w-full h-full"
          />
        </Col>
      </Row>
      <Spin spinning={loadingVerifyCode}>
        <Modal
          open={visibleVerifyCodeModal}
          onClose={() => setVisibleVerifyCodeModal(false)}
          onCancel={() => setVisibleVerifyCodeModal(false)}
          footer={false}
          title={t("verify_code.title")}
          maskClosable={false}
          destroyOnClose={true}
        >
          <VerifyCodeModal loading={loadingVerifyCode} handleVerifyCode={handleVerifyCode} />
        </Modal>
      </Spin>
    </LayoutAuthentication >
  );
};

export default SignUpPage;