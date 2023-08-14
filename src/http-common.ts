import axios from 'axios';

export const dashboardApi = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Content-type': 'application/json'
  },
});
export const dashboardAsyncApi = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  headers: {
    'Content-type': 'application/json'
  },
});

const brandsApi = axios.create({
  baseURL: '/api/brandsasync/',
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },  
});

export default {
  brandsApi
};
