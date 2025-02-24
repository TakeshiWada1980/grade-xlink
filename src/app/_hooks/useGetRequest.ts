import axios from "axios";
import useSWR from "swr";
import { ApiResponse, ApiErrorResponse } from "@/app/_types/ApiResponse";
import { AppErrorCode } from "@/app/_types/AppErrorCode";

export const useGetRequest = <T>(endpoint: string) => {
  const fetcher = async (url: string): Promise<ApiResponse<T>> => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    try {
      const response = await axios.get<ApiResponse<T>>(url, options);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // バックエンドからエラーデータが返っている場合はそのデータを利用
        if (error.response?.data) return error.response.data as ApiResponse<T>;

        // バックエンドからの情報がない場合は、こちらでエラーオブジェクトを生成
        const errorResponse: ApiErrorResponse = {
          httpStatus: error.response?.status || 400,
          success: false,
          data: null,
          error: {
            appErrorCode: AppErrorCode.AXIOS_ERROR,
            description: error.message,
            metadata: error,
          },
        };
        return errorResponse;
      }
      // Axios以外のエラーの場合も同様にエラーオブジェクトとして返す
      const errorResponse: ApiErrorResponse = {
        httpStatus: 400,
        success: false,
        data: null,
        error: {
          appErrorCode: AppErrorCode.AXIOS_ERROR,
          description: String(error),
          metadata: error,
        },
      };
      return errorResponse;
    }
  };

  return useSWR<ApiResponse<T>>(endpoint, fetcher);
};
