import { createContext, ReactNode, useState, useEffect } from "react";
import Router from "next/router";
import { toast } from 'react-toastify';
import { setupAPIClient } from "@/services/api";

interface BarberContextData {
    registerBarber: (credential: RegisterBarberProps) => Promise<void>
    listBarbers: (credential: string) => Promise<BarbersItem[]>
    updateDataBarber: (credential: UpdateBarberProps) => Promise<void>
    deleteBarber: (credential: string) => Promise<void>
    getTimeAvaliable: (credential: GetTimeAvaliableProps) => Promise<GetAvalibleTimesProps>
    getTimeAvaliableFast: (credential: GetTimeAvaliableProps) => Promise<GetAvalibleTimesProps>
}

interface BarbersItem {
    id: string
    name: string
    price: number | string
    status: boolean
    user_id: string
}

interface RegisterBarberProps {
    barber_name: string
    available_at: string[]
}

type BarberProviderProps = {
    children: ReactNode
}

interface UpdateBarberProps {
    barber_id: string
    barber_name: string
}

interface GetAvalibleTimesProps {
    id: string
    barber_name: string
    services: Service
}

interface Service {
    date: string
    times: string[]
}

interface GetTimeAvaliableProps {
    barber_id: string
    date: string
}


export const BarberContext = createContext({} as BarberContextData)

export function BarberProvider({ children }: BarberProviderProps) {

    async function registerBarber({ barber_name, available_at }: RegisterBarberProps) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/barber', {
                barber_name,
                available_at,
            })

            Router.push('/barbers')
            toast.success("Barbeiro cadastrado com sucesso!")
        } catch (err) {
            console.log(err);
            toast.error("Erro ao cadastrar barbeiro!")
        }
    }

    async function getTimeAvaliable({ barber_id, date }: GetTimeAvaliableProps) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/barber/times', {
                params: {
                    barber_id,
                    date
                }
            })

            return response.data
        } catch (err) {
            console.log(err);
        }
    }
    async function getTimeAvaliableFast({ barber_id, date }: GetTimeAvaliableProps) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/barber/times/fast', {
                params: {
                    barber_id,
                    date
                }
            })

            return response.data
        } catch (err) {
            console.log(err);
        }
    }

    async function listBarbers(status: string) {

        const boStats = status === "enabled" ? false : true

        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/barbers', {
                params: {
                    status: boStats
                }
            })

            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    async function updateDataBarber({ barber_name, barber_id }: UpdateBarberProps) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/barber', {
                barber_id,
                barber_name
            })

            Router.push('/barbers')
            toast.success("Dados atualizados com sucesso!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao atualizar dados!")
        }
    }

    async function deleteBarber(barber_id: string) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/barber/del', {
                barber_id
            })
            Router.push('/barbers')
            toast.success("Barbeiro excluído!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao excluir barbeiro!")
        }
    }

    return (
        <BarberContext.Provider value={{ registerBarber, updateDataBarber, deleteBarber, listBarbers, getTimeAvaliable, getTimeAvaliableFast }}>
            {children}
        </BarberContext.Provider>
    )
}