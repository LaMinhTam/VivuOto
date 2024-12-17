import numeral from 'numeral';
import moment from 'moment';
import {Dispatch} from '@reduxjs/toolkit';
import axios from 'axios';
import {Toast} from '@ant-design/react-native';
import {RefObject} from 'react';
import dayjs from "dayjs";

import { ethers } from 'ethers';
import { Asset } from 'react-native-image-picker';
import { CitizenIdentificationData, LicenseData } from '../store/profile/types';

export const formatPrice = (price: number) => {
  return numeral(price).format('0,0');
};

export const formatDate = (date: string | Date | number) => {
  // using moment to format timestamp to dd/mm/yyyy hh:mm
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export const convertDateToTimestamp = (date: string | Date) => {
  return moment(date).valueOf();
};

export const calculateDays = (
  startTimestamp: number | null,
  endTimestamp: number | null,
): number => {
  if (startTimestamp === null || endTimestamp === null) {
    return 0;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const differenceInMilliseconds = endTimestamp - startTimestamp;
  const numberOfDays = differenceInMilliseconds / millisecondsPerDay;
  return parseFloat(numberOfDays.toFixed(1));
};

export const handleUploadFile = async (formData: FormData) => {
  try {
    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data.secure_url; 
  } catch (error) {
      console.error('Error uploading image:', error);
  }
};

export async function handleUploadSignature(
  sigCanvas: RefObject<any>,
  rental_contract_id: string,
  userId: string,
) {
  try {
    const dataUrl = sigCanvas?.current
      ?.getTrimmedCanvas()
      ?.toDataURL('image/png');
    if (!dataUrl) {
      throw new Error('Failed to get data URL from signature canvas');
    }
    const blob = await (await fetch(dataUrl)).blob();
    // Check if the blob size exceeds 10MB
    const size = blob.size / 1024 / 1024;
    if (size > 10) {
      Toast.fail('Signature file size exceeds 10MB');
      return;
    }
    const timestamp = Date.now();
    const fileName = `signature_${userId}_${timestamp}.png`;

    const formData = new FormData();
    formData.append('file', blob);
    formData.append(
      'upload_preset',
      process.env.VITE_CLOUDINARY_PRESET_NAME || '',
    );
    formData.append('public_id', fileName);
    formData.append('folder', `contracts/${rental_contract_id}`);
    const imageUrl = await handleUploadFile(formData);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading signature:', error);
    return '';
  }
}

export const handleMetaMaskSignature = async (username: string, provider: any) => {
  if (username && provider) {
    try {
      const message = `Approve rental request for ${username}`;

      // Lấy tài khoản ví
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];

      // Tạo chữ ký với phương thức `personal_sign`
      const signature = await provider.request({
        method: "personal_sign",
        params: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), account],
      });

      return {
        account,
        signature,
        msg: message,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to sign with MetaMask");
    }
  } else {
    throw new Error("MetaMask is not connected or username is missing");
  }
};


export const connectWallet = async (open: Function, provider: any, isConnected: boolean): Promise<string | null> => {
  try {
    if (!isConnected) {
      await open();
    }
    
    const accounts = await provider.getAccounts();
    return accounts[0];
  } catch (error) {
    console.error("Error connecting to MetaMask via WalletConnect:", error);
    return null;
  }
};

export const getWalletBalance = async (address: string, provider: any): Promise<string | null> => {
  try {
    if (!provider) {
      Toast.fail("WalletConnect is not connected");
      return null;
    }

    const balance = await provider.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    return null;
  }
};

export const sendTransaction = async (
  provider: any,
  toAddress: string,
  amountInEth: string,
  address: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    if (!provider) {
      return {
        success: false,
        message: "WalletConnect chưa được cài đặt!",
      };
    }

    // const accounts = await provider.getAccounts();
    // const account = accounts[0];
    const amount = ethers.utils.parseEther(amountInEth);

    // Tạo giao dịch
    const transaction = {
      from: address,
      to: toAddress,
      value: amount.toHexString(),
    };

    // Gửi giao dịch
    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [transaction],
    });

    return {
      success: true,
      message: `Transaction sent successfully! TxHash: ${txHash}`,
    };
  } catch (error: any) {
    console.log("error:", error)
    if (
      error.code === "ACTION_REJECTED" ||
      error?.info?.error?.code === 4001
    ) {
      return {
        success: false,
        message: "Bạn đã hủy giao dịch!",
      };
    }
    return {
      success: false,
      message: "Lỗi khi gửi giao dịch. Vui lòng thử lại sau!",
    };
  }
};

export const handleRecognizeLicensePlate = async (
  formData: FormData
) => {
  try {
    const response = await axios.post(
      "https://api.fpt.ai/vision/dlr/vnm",
      formData,
      {
        headers: {
          "api-key": process.env.VITE_FPT_KYC_SECRET_KEY,
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
          "api-key": process.env.VITE_FPT_KYC_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      }
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

export const handleFormatLink = (msg: string, id: string) => {
  let requestId = "";
  let type = "";
  switch (msg) {
    case "LESSEE_SIGNED_CONTRACT":
      type === 'LESSOR'
      requestId = id;
      break;
    case "NEW_RENTAL_REQUEST":
      type === 'LESSOR'
      requestId = id;
      break;
    case "RENTAL_REQUEST_APPROVED":
      type === 'LESSEE'
      requestId = id;
      break;
    case "RENTAL_REQUEST_REJECTED":
      type === 'LESSEE'
      requestId = id;
      break;
    default:
      break;
  }
  return {
    requestId,
    type,
  };
};

export const convertTimestampToDayjs = (timestamp: number | null): dayjs.Dayjs | null => {
  if (timestamp === null) {
    return null;
  }
  const seconds = timestamp.toString().length === 13 ? Math.floor(timestamp / 1000) : timestamp;
  return dayjs.unix(seconds);
};