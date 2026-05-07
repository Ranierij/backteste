'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Cadastro() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nomeEmpresa, setNomeEmpresa] = useState("")
    const [empresaId, setEmpresaId] = useState(null)


    const router = useRouter()

    const cadastrar = async () => {
        if (loading) return
        setLoading(true)

        // 🔥 VALIDAÇÕES
        if (!nomeEmpresa) {
            alert("Informe o nome da empresa")
            setLoading(false)
            return
        }

        if (!email || !password) {
            alert("Preencha email e senha")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            alert("A senha precisa ter no mínimo 6 caracteres")
            setLoading(false)
            return
        }

        if (!email.includes("@")) {
            alert("Email inválido")
            setLoading(false)
            return
        }

        // 🔥 CRIA USUÁRIO
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password
        })

        if (signUpError) {
            alert(signUpError.message)
            setLoading(false)
            return
        }

        // 🔥 LOGIN AUTOMÁTICO
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (loginError) {
            alert("Conta criada, mas erro ao logar automaticamente")
            setLoading(false)
            return
        }

        // 🔥 ESPERA SESSÃO (CRÍTICO)
        let user = null

        for (let i = 0; i < 5; i++) {
            const { data } = await supabase.auth.getUser()
            user = data?.user

            if (user) break

            await new Promise(res => setTimeout(res, 300))
        }

        if (!user) {
            alert("Erro ao autenticar usuário")
            setLoading(false)
            return
        }



        alert("Conta criada com sucesso")
        setLoading(false)

        router.push('/agenda')
    }

    return (
        <div className="min-h-screen flex">

            {/* ESQUERDA */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 px-6">
                <div className="w-full max-w-md space-y-6 text-center">

                    <h1 className="text-4xl font-bold text-purple-700">
                        Criar Conta
                    </h1>

                    <p className="text-purple-600">
                        Cadastre-se para começar
                    </p>

                    {/* INPUTS */}
                    <div className="space-y-3 text-left">

                        {/* 🔥 NOME DA EMPRESA */}
                        <input
                            placeholder="Nome da empresa"
                            value={nomeEmpresa}
                            onChange={(e) => setNomeEmpresa(e.target.value)}
                            className="w-full p-3 border rounded-md bg-white"
                        />

                        <input
                            placeholder="Email"
                            className="w-full p-3 border rounded-md bg-white"
                            onChange={e => setEmail(e.target.value)}
                        />

                        <div className="relative">
                            <input
                                type={mostrarSenha ? "text" : "password"} placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border p-3 rounded-lg"
                            />

                            <span
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-3 cursor-pointer"
                            >
                                {mostrarSenha ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <button
                        onClick={cadastrar}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                    {/* VOLTAR LOGIN */}
                    <p className="text-sm text-gray-600">
                        Já possui uma conta?{' '}
                        <Link href="/login" className="text-purple-700 font-semibold">
                            Entrar
                        </Link>
                    </p>

                </div>
            </div>

            {/* DIREITA */}
            <div className="hidden md:block w-[40%] 
                bg-[url('/lateral.jpg')] 
                bg-cover 
    bg-center 
    bg-no-repeat">
            </div>

        </div>
    )
}