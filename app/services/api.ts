'use server'

import axios from "axios";

export const api = axios.create({
  baseURL: 'https://rastreador-f9849afda432.herokuapp.com',
});