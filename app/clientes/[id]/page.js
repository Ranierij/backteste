"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function EditarCliente({ params }) {

    const id = React.use(params).id

    const router = useRouter()

    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")

    useEffect(() => {
        carregarCliente()
    }, [])

    async function carregarCliente() {

        const { data, error } = await supabase
            .from("clientes")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            console.log(error)
            return
        }

        setNome(data.nome || "")
        setTelefone(data.telefone || "")
    }

    async function salvar() {

        const { error } = await supabase
            .from("clientes")
            .update({
                nome,
                telefone
            })
            .eq("id", id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Cliente atualizado")

        router.push("/clientes")
    }

    async function excluir() {

        const confirmar = confirm("Deseja excluir?")

        if (!confirmar) return

        const { error } = await supabase
            .from("clientes")
            .delete()
            .eq("id", id)

        if (error) {
            alert(error.message)
            return
        }

        alert("Cliente excluído")

        router.push("/clientes")
    }

    return (
        <div className="p-6 max-w-xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">
                Editar Cliente
            </h1>

            <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border p-3 rounded mb-4"
            />

            <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full border p-3 rounded mb-4"
            />

            <button
                onClick={salvar}
                className="w-full bg-blue-500 text-white p-3 rounded mb-3"
            >
                Salvar
            </button>

            <button
                onClick={excluir}
                className="w-full bg-red-500 text-white p-3 rounded"
            >
                Excluir
            </button>

        </div>
    )
}