'use client'

import { useState, useEffect } from 'react'

type Article = {
  id: string
  type: string
  title: string
  authors: string | null
  year: number | null
  journal: string | null
  bookTitle: string | null
  publisher: string | null
  edition: string | null
  pages: string | null
  url: string | null
  doi: string | null
  abstract: string | null
  tags: string | null
  status: string
  addedAt: string
  geminiReview: string | null
}

type Props = {
  item: Article
  onClose: () => void
  onDone: () => void
}

export default function EditModal({ item, onClose, onDone }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [doiLoading, setDoiLoading] = useState(false)

  const [type, setType] = useState(item.type || 'article')
  const [title, setTitle] = useState(item.title)
  const [authors, setAuthors] = useState(item.authors || '')
  const [year, setYear] = useState(item.year ? String(item.year) : '')
  const [journal, setJournal] = useState(item.journal || '')
  const [bookTitle, setBookTitle] = useState(item.bookTitle || '')
  const [publisher, setPublisher] = useState(item.publisher || '')
  const [edition, setEdition] = useState(item.edition || '')
  const [pages, setPages] = useState(item.pages || '')
  const [url, setUrl] = useState(item.url || '')
  const [doi, setDoi] = useState(item.doi || '')
  const [abstract, setAbstract] = useState(item.abstract || '')
  const [tags, setTags] = useState(item.tags || '')
  const [status, setStatus] = useState(item.status)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/articles/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          authors: authors || null,
          year: year ? Number(year) : null,
          journal: journal || null,
          bookTitle: bookTitle || null,
          publisher: publisher || null,
          edition: edition || null,
          pages: pages || null,
          url: url || null,
          doi: doi || null,
          abstract: abstract || null,
          tags: tags || null,
          status,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail || data?.error || 'Falha ao atualizar')
      }
      onDone()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar')
    } finally {
      setLoading(false)
    }
  }

  const fetchByDoi = async () => {
    if (!doi) return
    setDoiLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/doi?doi=${encodeURIComponent(doi)}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'DOI não encontrado')
      }
      const data = await res.json()
      if (data.title) setTitle(data.title)
      if (data.authors) setAuthors(data.authors)
      if (data.year) setYear(String(data.year))
      if (data.journal && type === 'article') setJournal(data.journal)
      if (data.bookTitle && (type === 'book' || type === 'book_chapter')) setBookTitle(data.bookTitle)
      if (data.publisher && type === 'book') setPublisher(data.publisher)
      if (data.url) setUrl(data.url)
      if (data.abstract) setAbstract(data.abstract)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar DOI')
    } finally {
      setDoiLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-24">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white shadow-lg flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 shrink-0">
          <h2 className="text-base font-semibold text-neutral-900">Editar item</h2>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-800">
            Fechar
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            >
              <option value="article">Artigo</option>
              <option value="book">Livro</option>
              <option value="book_chapter">Capítulo de livro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Título *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Autores</label>
            <input value={authors} onChange={(e) => setAuthors(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Ano</label>
            <input value={year} onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            />
          </div>

          {type === 'article' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Revista / Journal</label>
              <input value={journal} onChange={(e) => setJournal(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
              />
            </div>
          )}

          {(type === 'book' || type === 'book_chapter') && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Livro</label>
              <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
              />
            </div>
          )}

          {type === 'book' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Editora</label>
              <input value={publisher} onChange={(e) => setPublisher(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
              />
            </div>
          )}

          {type === 'book' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Edição</label>
              <input value={edition} onChange={(e) => setEdition(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
              />
            </div>
          )}

          {(type === 'book' || type === 'book_chapter') && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Páginas</label>
              <input value={pages} onChange={(e) => setPages(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">DOI</label>
            <div className="flex gap-2">
              <input value={doi} onChange={(e) => setDoi(e.target.value)}
                placeholder="10.xxxx/..."
                className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={fetchByDoi}
                disabled={doiLoading}
                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
              >
                {doiLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Resumo / Notas</label>
            <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={4}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Tags</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="IA, ética, LLM"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
            >
              <option value="want_to_read">Quero ler</option>
              <option value="reading">Lendo</option>
              <option value="read">Já li</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="text-sm px-4 py-2 rounded-xl border border-neutral-300 text-neutral-900 hover:bg-neutral-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="text-sm px-4 py-2 rounded-xl bg-black text-white hover:opacity-80 disabled:opacity-50">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
