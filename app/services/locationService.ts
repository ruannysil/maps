import { api } from './api';

interface LocationData {
  latitude: number;
  longitude: number;
}

export async function getAllLocations() {
  const response = await api.get('/location');
  return response.data;
}

export async function postLocation(data: LocationData) {
  const response = await api.post('/location', data);
  return response.data;
}

export async function getRandomLocation() {
  const response = await api.get('/location-random');
  return response.data;
}
