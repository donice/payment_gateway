import axios from 'axios';

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = axios.defaults.headers.common['Authorization'];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;


interface FetchOptions extends RequestInit {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
}
interface CustomError extends Error {
  data?: any;
}
/** This uses fetch api to make http requests and mimics axios */
export async function https<T>(
  url: string = base_url as string,
  options: FetchOptions,
  params?: Record<string, string>
): Promise<T> {
  if (params) {
    if (options.method === "GET" || options.method === "HEAD") {
      const urlParams = new URLSearchParams(params);
      url += `?${urlParams.toString()}`;
    }
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // Optionally handle non-2xx responses
      const error: CustomError = new Error(`HTTP error! status: ${res.status}`);
      error.data = await res.json();
      throw error;
    }

    const data: T = await res.json();
    return data;
  } catch (error) {
    // Improved error handling
    if (error instanceof Error) {
      // console.log({ u: error.stack });
      // console.error(`Fetch error: ${error.message}`);
      throw error;
    }
    console.error("Unknown error: error");
    throw new Error("Unknown error occurred during fetch");
  }
}