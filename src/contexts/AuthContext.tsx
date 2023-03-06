import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "@/services/apiClient";
import { toast } from 'react-toastify';
import { setupAPIClient } from "@/services/api";

interface AuthContextData {
    user: UserProps
    isAuthenticated: boolean
    signIn: (credentials: SignInProps) => Promise<void>
    signUp: (credentials: SignUpProps) => Promise<void>
    logoutUser: () => Promise<void>
    updateUser: (credentials: UserUpdateProps) => Promise<void>
}

interface UserProps {
    id: string
    name: string
    email: string
    address: string | null
    subscriptions?: SusbcriptionsProps | null
}

interface SusbcriptionsProps {
    id: string
    status: string
}

type AuthProviderProps = {
    children: ReactNode
}

interface SignInProps {
    email: string
    password: string
}

interface SignUpProps {
    name: string
    email: string
    password: string
}

interface UserUpdateProps {
    name: string
    address: string
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(null, '@barber.token', { path: '/' })
        Router.push('/login')

    } catch (error) {
        toast.error("Error ao sair!")
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user

    useEffect(() => {

        const { '@barber.token': token } = parseCookies()

        if (token) {
            api.get('/me').then(res => {
                const { id, name, address, email, subscriptions } = res.data
                setUser({ id, name, address, email, subscriptions })
            }).catch(err => {
                signOut()
            })
        }

    }, [])

    async function signIn({ email, password }: SignInProps) {

        try {
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token, subscriptions, address } = response.data

            setCookie(undefined, '@barber.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                id,
                name,
                email,
                subscriptions,
                address
            })

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`

            toast.success("Logado com sucesso!")

            Router.push('/dashboard')

        } catch (error) {
            toast.error("Erro ao acessar!")
        }
    }

    async function signUp({ email, name, password }: SignUpProps) {
        try {
            await api.post('/users', {
                name,
                email,
                password
            })

            toast.success("Cadastrado com sucesso!")

            Router.push('/login')
        } catch (error) {
            toast.error("Erro ao cadastrar!")
        }
    }

    async function logoutUser() {
        try {
            signOut()
            setUser(null)

        } catch (error) {
            toast.error("Erro ao deslogar!")
        }
    }

    async function updateUser({ name, address }: UserUpdateProps) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/user/update', {
                name: name,
                address: address,
            })

            toast.success("Dados alterados com sucesso!")

        } catch (err) {
            toast.error("Erro ao atualizar dados!")
        }

    }
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, logoutUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}