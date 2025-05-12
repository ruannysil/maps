'use server'

import { api } from './api';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export async function getAllLocations() {
  try {
    const response = await api.get('/location');
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

export async function postLocation(data: LocationData) {
  try {
    const response = await api.post('/location', data);
    return response.data;
  } catch (error) {
    console.error('Error posting location:', error);
    throw error;
  }
}

export async function getRandomLocation() {
  try {
    const response = await api.get('/location-random');
    return response.data;
  } catch (error) {
    console.error('Error fetching random location:', error);
    throw error;
  }
}
