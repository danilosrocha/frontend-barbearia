import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

import { AuthTokenError } from './erros/AuthTokenError';
import { signOut } from '@/contexts/AuthContext';
import configEnv from './config';

export function setupAPIClient(ctx = undefined) {
    const apiUrl = configEnv === "PROD" ? "https://backend-barber.up.railway.app" : process.env.NEXT_PUBLIC_API_URL_HML;
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            Authorization: `Bearer ${cookies['@barber.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response.status === 401) {
            if (typeof window !== undefined) {
                signOut()
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error);

    })


    return api;
}