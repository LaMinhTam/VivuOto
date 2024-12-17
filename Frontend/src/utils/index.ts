import Cookies from "js-cookie";
import {
  BrowserProvider,
  ethers,
  formatEther,
  parseEther,
} from "ethers";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../store/auth/types";
import CryptoJS from "crypto-js";
import numeral from "numeral";
import moment from "moment";
import { GetProp, message } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { setUploadProgress } from "../store/rental/reducers";
import { AppDispatch } from "../store/store";
import { RefObject } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  CitizenIdentificationData,
  LicenseData,
} from "../store/profile/types";
import {} from "../constants";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { TFunction } from "i18next";

const accessTokenKey = "VCAR_ACCESS_TOKEN";
const refreshTokenKey = "VCAR_REFRESH_TOKEN";
const userKey = "VCAR_USER";

const objCookies = {
  expires: 30,
  domain:
    typeof window !== "undefined"
      ? window.location.hostname
      : "localhost",
};

export const saveAccessToken = (access_token: string) => {
  if (access_token) {
    Cookies.set(accessTokenKey, access_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: "/",
      domain:
        typeof window !== "undefined"
          ? window.location.hostname
          : "localhost",
    });
  }
};

export const saveRefreshToken = (refresh_token: string) => {
  if (refresh_token) {
    Cookies.set(refreshTokenKey, refresh_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: "/",
      domain:
        typeof window !== "undefined"
          ? window.location.hostname
          : "localhost",
    });
  }
};

export const saveUser = (id: string) => {
  if (id) {
    Cookies.set(userKey, id, {
      ...objCookies,
    });
  } else {
    Cookies.remove(userKey, {
      ...objCookies,
      path: "/",
      domain: window.location.hostname,
    });
  }
};

export const getAccessToken = () => {
  const access_token = Cookies.get(accessTokenKey);
  return access_token;
};

export const getRefreshToken = () => {
  const refresh_token = Cookies.get(refreshTokenKey);
  return refresh_token;
};

export const getUser = () => {
  const user = Cookies.get(userKey);
  return user;
};

export const isTokenExpire = (token: string) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);

  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken.exp && decodedToken.exp < currentTime) {
    return true;
  } else {
    return false;
  }
};

export function getUserInfoFromCookie() {
  const accessToken = getAccessToken();
  const encryptedUser = getUser();
  let decryptedData: IUser = {} as IUser;
  if (encryptedUser && accessToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, accessToken);
    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  return decryptedData;
}

export function saveUserInfoToCookie(
  user: IUser,
  accessToken: string
) {
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(user),
    accessToken
  ).toString();
  saveUser(cipherText);
}

export const formatPrice = (price: number) => {
  return numeral(price).format("0,0");
};

export const formatDate = (date: string) => {
  // using moment to format timestamp to dd/mm/yyyy hh:mm
  return moment(date).format("DD/MM/YYYY HH:mm");
};

export const convertDateToTimestamp = (date: string) => {
  return moment(date).valueOf();
};

export const calculateDays = (
  startTimestamp: number | null,
  endTimestamp: number | null
): number => {
  if (startTimestamp === null || endTimestamp === null) {
    return 0;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const differenceInMilliseconds = endTimestamp - startTimestamp;
  const numberOfDays = differenceInMilliseconds / millisecondsPerDay;
  return parseFloat(numberOfDays.toFixed(1));
};

export const handleMetaMaskSignature = async (username: string) => {
  if (window?.ethereum && username) {
    try {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      const message = `Approve rental request for ${username}`;
      const signature = await provider.send("personal_sign", [
        message,
        account,
      ]);
      return {
        account,
        signature,
        msg: message,
      };
    } catch (error) {
      console.error(error);
      message.error("Failed to sign with MetaMask");
    }
  } else {
    message.error(
      "MetaMask is not installed or user data is missing"
    );
  }
};

// Kiểm tra xem MetaMask đã được cài đặt chưa
export const isMetaMaskInstalled = (): boolean => {
  return typeof window.ethereum !== "undefined";
};

// Hàm kết nối MetaMask và lấy địa chỉ ví
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    // Yêu cầu kết nối ví
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Lấy địa chỉ ví đầu tiên
    return accounts[0];
  } catch (error) {
    console.error("Lỗi khi kết nối với MetaMask:", error);
    return null;
  }
};

export const getWalletBalance = async (
  address: string,
  t: TFunction<"translation", undefined>
): Promise<string | null> => {
  try {
    if (!isMetaMaskInstalled()) {
      message.error(t("msg.METAMASK_NOT_INSTALLED"));
      return null;
    }

    const provider = new BrowserProvider(window.ethereum);

    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error("Lỗi khi lấy số dư ví:", error);
    message.error(t("msg.METAMASK_UNDEFINED_ERROR"))
    return null;
  }
};

export const sendTransaction = async (
  toAddress: string,
  amountInEth: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    if (!isMetaMaskInstalled()) {
      return {
        success: false,
        message: "msg.METAMASK_NOT_INSTALLED",
      };
    }

    const provider = new BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const amount = parseEther(amountInEth);

    const tx = await signer.sendTransaction({
      to: toAddress,
      value: amount,
    });
    await tx.wait();

    // Giao dịch thành công
    return {
      success: true,
      message: "msg.TRANSACTION_SUCCESS",
    };
  } catch (error: any) {
    if (
      error.code === "ACTION_REJECTED" ||
      error?.info?.error?.code === 4001
    ) {
      return {
        success: false,
        message: "msg.TRANSACTION_CANCEL",
      };
    }
    return {
      success: false,
      message: "msg.TRANSACTION_FAILED",
    };
  }
};

export const fetchImageFromUrl = async (
  url: string
): Promise<ArrayBuffer> => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching image from URL:", error);
    throw error;
  }
};

export async function handleUploadSignature(
  sigCanvas: RefObject<SignatureCanvas>,
  dispatch: AppDispatch,
  rental_contract_id: string,
  userId: string,
  setLoading: (value: boolean) => void
) {
  try {
    const dataUrl = sigCanvas?.current
      ?.getTrimmedCanvas()
      ?.toDataURL("image/png");
    if (!dataUrl) {
      throw new Error("Failed to get data URL from signature canvas");
    }
    const blob = await (await fetch(dataUrl)).blob();
    // Check if the blob size exceeds 10MB
    const size = blob.size / 1024 / 1024;
    if (size > 10) {
      message.error("File size must be less than 10MB");
      setLoading(false);
      return;
    }
    const timestamp = Date.now();
    const fileName = `signature_${userId}_${timestamp}.png`;

    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
    );
    formData.append("public_id", fileName);
    formData.append("folder", `contracts/${rental_contract_id}`);
    const imageUrl = await handleUploadFile(formData, dispatch);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading signature:", error);
    return "";
  }
}

export const handleRecognizeLicensePlate = async (
  formData: FormData
) => {
  try {
    const response = await axios.post(
      "https://api.fpt.ai/vision/dlr/vnm",
      formData,
      {
        headers: {
          "api-key": import.meta.env.VITE_FPT_KYC_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response?.data?.data) {
      return {
        success: true,
        data: response.data.data.at(0) as LicenseData,
      };
    }
  } catch (error) {
    console.error("Error during recognition:", error);
    return { success: false, data: null };
  }
};

export const handleRecognizeCitizenIdentification = async (
  formData: FormData
) => {
  try {
    const response = await axios.post(
      "https://api.fpt.ai/vision/idr/vnm",
      formData,
      {
        headers: {
          "api-key": import.meta.env.VITE_FPT_KYC_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(
      "handleRecognizeCitizenIdentification ~ response:",
      response.data
    );
    console.log(
      "handleRecognizeCitizenIdentification ~ response:",
      response.data.data.at(0)
    );

    if (response?.data?.data) {
      return {
        success: true,
        data: response.data.data.at(0) as CitizenIdentificationData,
      };
    }
  } catch (error) {
    console.error("Error during recognition:", error);
    return { success: false, data: null };
  }
};

export const handleUploadFile = async (
  formData: FormData,
  dispatch: AppDispatch
) => {
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (typeof progressEvent.total === "number") {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUploadProgress(percentCompleted));
          } else {
            toast.warn("Total size is undefined.");
            dispatch(setUploadProgress(0));
          }
        },
      }
    );
    const imageUrl = response.data.secure_url;
    if (imageUrl) {
      return imageUrl;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const handleFormatLink = (msg: string, id: string) => {
  let url = "";
  switch (msg) {
    case "LESSEE_SIGNED_CONTRACT":
      url = `lessor-contract/${id}`;
      break;
    case "NEW_RENTAL_REQUEST":
      url = `my-car-lessee/${id}`;
      break;
    case "RENTAL_REQUEST_APPROVED":
      url = `lessee-contract/${id}`;
      break;
    case "RENTAL_REQUEST_REJECTED":
      url = `my-trips/${id}`;
      break;
    default:
      url = "#";
      break;
  }
  return url;
};

// export const handleDeleteFile = async (fileUrl: string) => {
//   try {
//       const urlParts = fileUrl.split("/");
//       const fileName = urlParts[urlParts.length - 1];
//       const [publicId] = fileName.split(".");
//       const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//       const timestamp = new Date().getTime();
//       const signature = generateSHA1(
//           generateSignature(
//               publicId,
//               process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET as string,
//               timestamp
//           )
//       );

//       const response = await axiosInstance.post(
//           `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
//           {
//               public_id: publicId,
//               timestamp,
//               api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//               signature,
//           }
//       );
//       console.log("handleDeleteFile ~ response:", response);

//       // Check the response
//       if (response.data.result === "ok") {
//           return true;
//       } else {
//           return false;
//       }
//   } catch (error) {
//       console.error("Error deleting file:", error);
//   }
// };

export function beforeUpload(
  file: RcFile,
  fileList: RcFile[],
  t: TFunction<"translation", undefined>
) {
  const allowTypes = ["jpg", "jpeg", "png", "gif"];
  const isImage = allowTypes.includes(
    file.name.split(".").pop() || ""
  );
  const isLessThan1M = file.size / 1024 / 1024 < 1;

  if (!isImage) {
    fileList.pop();
    message.error(t("car.cantUploadImage"));
  }
  if (!isLessThan1M) {
    fileList.pop();
    message.error(t("product.cantFitSizeUpload"));
  }

  return isImage && isLessThan1M;
}

export const isAbleUpload = (file: UploadFile) => {
  const allowTypes = ["jpg", "jpeg", "png", "gif"];
  const isImage = allowTypes.includes(
    file.name.split(".").pop() || ""
  );
  if (!isImage) {
    message.error("Chỉ hỗ trợ định dạng ảnh jpg, jpeg, png, gif");
  }
  const isLessThan1M = (file?.size ?? 0) / 1024 / 1024 < 1;
  if (!isLessThan1M) {
    message.error("Kích thước ảnh phải nhỏ hơn 1MB");
  }
  return isImage && isLessThan1M;
};

export type FileType = Parameters<
  GetProp<UploadProps, "beforeUpload">
>[0];

export const onPreview = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as FileType);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};
