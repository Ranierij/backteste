"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Colaboradores() {

    const router = useRouter()
    const { user } = useAuth()

    const [nome, setNome] = useState("")
    const [colaboradores, setColaboradores] = useState([])
    const [empresaId, setEmpresaId] = useState(null)

    useEffect(() => {

        carregar()

        async function carregarPerfil() {

            if (!user) return

            const { data, error } = await supabase
                .from("perfis")
                .select("*")
                .eq("user_id", user.id)
                .single()

            if (error) {
                console.log(error)
                return
            }

            console.log("EMPRESA:", data.empresa_id)

            setEmpresaId(data.empresa_id)
        }

        carregarPerfil()

    }, [user])

    async function carregar() {
        const { data } = await supabase
            .from("colaboradores")
            .select("*")
            .order("created_at", { ascending: false })

        setColaboradores(data || [])
    }

    async function salvar() {

        if (!nome) return alert("Nome obrigatório")

        if (!empresaId) {
            alert("Empresa não carregada")
            return
        }

        const { data: authData } = await supabase.auth.getUser()
        console.log("EMPRESA ID:", empresaId)
        const { error } = await supabase
            .from("colaboradores")
            .insert({
                nome,
                user_id: authData?.user?.id,
                empresa_id: empresaId
            })

        if (error) {
            alert(error.message)
            return
        }

        setNome("")
        carregar()
    }

    async function excluir(id) {

        const ok = confirm("Excluir colaborador?")
        if (!ok) return

        await supabase.from("colaboradores").delete().eq("id", id)
        carregar()
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

                <div className="flex justify-between mb-4">
                    <button onClick={() => router.push("/agenda")}>←</button>
                    <h1 className="font-bold">Colaboradores</h1>
                </div>

                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    className="w-full border p-2 mb-2"
                />

                <button
                    onClick={salvar}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Salvar
                </button>

                <div className="mt-4 space-y-2">
                    {colaboradores.map(c => (
                        <div key={c.id} className="flex justify-between border p-2 rounded">
                            <span>{c.nome}</span>

                            <button
                                onClick={() => excluir(c.id)}
                                className="bg-red-500 text-white px-2 rounded"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}