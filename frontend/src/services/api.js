import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const getPrediction = async (formData) => {
  const { data } = await api.post('/predict', formData);
  return data;
};
