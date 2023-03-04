import { createContext, ReactNode, useState, useEffect } from "react";
import Router from "next/router";
import { api } from "@/services/apiClient";
import { toast } from 'react-toastify';

interface HaircutContextData {
    registerHaircut: (credential: RegisterHaircutProps) => Promise<void>
    listHaircuts: (credential: string) => Promise<HaircutsItem[]>
    updateHaircut: (credential: UpdateHaircutProps) => Promise<void>
    registerNewCut: (credential: RegisteNewCutProps) => Promise<void>
    finishCut: (credential: string) => Promise<void>
}

interface HaircutsItem {
    id: string
    name: string
    price: number | string
    status: boolean
    user_id: string
}

interface RegisterHaircutProps {
    name: string
    price: number | string
}

type HaircutProviderProps = {
    children: ReactNode
}

interface UpdateHaircutProps {
    haircut_id: string
    name: string
    price: number | string
    status: string
}

interface RegisteNewCutProps {
    customer: string
    haircut_id: string
}


export const HaircutContext = createContext({} as HaircutContextData)

export function HaircutProvider({ children }: HaircutProviderProps) {

    async function registerHaircut({ name, price }: RegisterHaircutProps) {
        try {
            await api.post('/haircut', {
                name,
                price
            })
            Router.push('/haircuts')
            toast.success("Corte cadastrado com sucesso!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao cadastrar corte!")
        }
    }

    async function listHaircuts(status: string) {

        const boStats = status === "enabled" ? false : true

        try {
            const response = await api.get('/haircuts', {
                params: {
                    status: boStats
                }
            })

            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    async function updateHaircut({ name, price, haircut_id, status }: UpdateHaircutProps) {
        try {

            await api.put('/haircut', {
                haircut_id,
                name,
                price: Number(price),
                status: status === "enabled" ? "true" : "false"
            })

            Router.push('/haircuts')
            toast.success("Corte atualizado com sucesso!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao cadastrar corte!")
        }
    }

    async function registerNewCut({ customer, haircut_id }: RegisteNewCutProps) {
        try {
            await api.post('/schedule', {
                customer,
                haircut_id
            })
            Router.push('/dashboard')
            toast.success("Agendamento realizado com sucesso!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao cadastrar agendamento!")
        }
    }

    async function finishCut(schedule_id: string) {
        try {
            await api.delete('/schedule', {
                params: {
                    schedule_id
                }
            })
            Router.push('/dashboard')
            toast.success("Serviço finalizado!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao finalizar corte!")
        }
    }


    return (
        <HaircutContext.Provider value={{ registerHaircut, listHaircuts, updateHaircut, registerNewCut, finishCut }}>
            {children}
        </HaircutContext.Provider>
    )
}