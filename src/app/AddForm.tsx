'use client'
import { useState } from 'react'

type Props = { onDone?: () => void }


export default function AddForm({ onDone }: Props) {
  const [open, setOpen] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const body = {
      title: (fd.get('title') as string) || '',
      authors: (fd.get('authors') as string),
      journal: (fd.get('journal') as string),
      year: fd.get('year') ? Number(fd.get('year')) : undefined,
      url: (fd.get('url') as string),
      doi: (fd.get('doi') as string),
      status: (fd.get('status') as string) || 'want_to_read',
    }
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      form.reset()
      setOpen(false)
      onDone?.()
    } else {
      alert('Erro ao salvar artigo')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium px-4 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90"
      >
        + Adicionar
      </button>

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold">Novo artigo</h3>
          <input name="title" placeholder="Título *" className="w-full rounded-xl border px-3 py-2 text-sm" required />
          <div className="grid grid-cols-3 gap-2">
            <input name="authors" placeholder="Autores" className="rounded-xl border px-3 py-2 text-sm" />
            <input name="journal" placeholder="Revista/Evento" className="rounded-xl border px-3 py-2 text-sm" />
            <input name="year" placeholder="Ano" type="number" className="rounded-xl border px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input name="url" placeholder="URL" className="rounded-xl border px-3 py-2 text-sm" />
            <input name="doi" placeholder="DOI" className="rounded-xl border px-3 py-2 text-sm" />
          </div>
          <select name="status" className="w-full rounded-xl border px-3 py-2 text-sm">
            <option value="want_to_read">Quero ler</option>
            <option value="reading">Lendo</option>
            <option value="read">Já li</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="text-sm px-4 py-2 rounded-xl border">Cancelar</button>
            <button type="submit" className="text-sm px-4 py-2 rounded-xl bg-gray-900 text-white">Salvar</button>
          </div>
        </form>
      )}
    </div>
  )
}
