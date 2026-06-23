'use client'
import { useTransition } from 'react'

export default function StatusForm({ id, current }: { id: string; current: string }) {
  const [pending, start] = useTransition()

  const update = (formData: FormData) => {
    start(async () => {
      await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: formData.get('status') }),
      })
      globalThis.location.reload()
    })
  }

  const remove = () => {
    start(async () => {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      globalThis.location.reload()
    })
  }

  return (
    <form action={update} className="flex items-center gap-1">
      <select
        name="status"
        defaultValue={current}
        disabled={pending}
        className="text-xs rounded-lg border px-2 py-1 bg-white"
      >
        <option value="want_to_read">Quero ler</option>
        <option value="reading">Lendo</option>
        <option value="read">Já li</option>
      </select>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-xs px-2 py-1 rounded-lg border text-red-700 hover:bg-red-50"
        title="Remover"
      >
        ✕
      </button>
    </form>
  )
}
