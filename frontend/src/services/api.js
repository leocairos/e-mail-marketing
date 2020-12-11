import axios from 'axios';
import { getToken } from './auth';

const baseApi = (baseUrl) => {
  const api = axios.create({
    baseURL: baseUrl
  })

  api.interceptors.request.use(async (config) => {
    const token = getToken();

    if (token) {
      config.headers['x-access-token'] = token
    }

    return config;
  })

  return api;
}

export default baseApi;