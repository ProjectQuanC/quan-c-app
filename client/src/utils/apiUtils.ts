import axios, { AxiosRequestConfig } from 'axios';

export const fetchData = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axios.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

