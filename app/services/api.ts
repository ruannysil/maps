'use server'

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://rastreador-f9849afda432.herokuapp.com',
});