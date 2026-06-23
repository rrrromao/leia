'use client'

import { useState, useEffect } from 'react'
import AddForm from './AddForm'
import StatusForm from './components/StatusForm.client'

type Article = {
  id: string
  title: string
  authors: string | null
  year: number | null
  journal: string | null
  url: string | null
  doi: string | null
  status: string
  addedAt: string
  geminiReview: string | null
}

export default function HomeClient() {
  const [items, setItems] = useState<Article[]>([])
  const [tab, setTab] = useState<'want' | 'reading' | 'done'>('want')
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setError('')
      const res = await fetch('/api/articles')
      if (!res.ok) throw new Error()
      const data = (await res.json()) as Article[]
      setItems(data)
    } catch {
      setError('Erro ao carregar artigos.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const want = items.filter((a) => a.status === 'want_to_read')
  const reading = items.filter((a) => a.status === 'reading')
  const done = items.filter((a) => a.status === 'read')
  const list = tab === 'want' ? want : tab === 'reading' ? reading : done

  return (
    <div className="space-y-6">
      <section className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Lista de Leitura</h1>
          <p className="text-sm text-neutral-500 mt-1">Artigos da sua pesquisa</p>
        </div>
        <AddForm onDone={load} />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex border-b border-neutral-200">
          {(['want', 'reading', 'done'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium ${
                tab === t
                  ? 'border-b-2 border-neutral-900 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {t === 'want'
                ? `Quero ler (${want.length})`
                : t === 'reading'
                ? `Lendo (${reading.length})`
                : `Já li (${done.length})`}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            Nenhum artigo nesta lista.
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {list.map((a) => (
              <li key={a.id} className="p-4 hover:bg-neutral-50/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm leading-snug text-neutral-900">{a.title}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {[a.authors, a.journal, String(a.year)]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {a.geminiReview && (
                      <p className="text-xs text-neutral-700 mt-2 bg-neutral-50 rounded-lg p-2 border border-neutral-200 leading-relaxed">
                        {a.geminiReview}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-100 text-neutral-900"
                      >
                        Abrir
                      </a>
                    )}
                    <StatusForm id={a.id} current={a.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
