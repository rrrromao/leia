'use client'
import { useState } from 'react'

type Props = { onDone?: () => void }

export default function AddForm({ onDone }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [doiLoading, setDoiLoading] = useState(false)
  const [error, setError] = useState('')

  const [type, setType] = useState<'article' | 'book' | 'book_chapter'>('article')
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')
  const [year, setYear] = useState('')
  const [journal, setJournal] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [publisher, setPublisher] = useState('')
  const [edition, setEdition] = useState('')
  const [pages, setPages] = useState('')
  const [url, setUrl] = useState('')
  const [doi, setDoi] = useState('')
  const [abstract, setAbstract] = useState('')
  const [tags, setTags] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const reset = () => {
    setType('article')
    setTitle('')
    setAuthors('')
    setYear('')
    setStartDate('')
    setEndDate('')
    setJournal('')
    setBookTitle('')
    setPublisher('')
    setEdition('')
    setPages('')
    setUrl('')
    setDoi('')
    setAbstract('')
    setTags('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          authors: authors || null,
          year: year ? Number(year) : null,
          startDate: startDate || null,
          endDate: endDate || null,
          journal: journal || null,
          bookTitle: bookTitle || null,
          publisher: publisher || null,
          edition: edition || null,
          pages: pages || null,
          url: url || null,
          doi: doi || null,
          abstract: abstract || null,
          tags: tags || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail || data?.error || 'Falha ao salvar')
      }
      reset()
      setOpen(false)
      onDone?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-xl bg-black text-white text-sm px-4 py-2 hover:opacity-80"
      >
        + Adicionar
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-24">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white shadow-lg flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 shrink-0">
          <h2 className="text-base font-semibold text-neutral-900">Novo item</h2>
          <button type="button" onClick={() => { reset(); setOpen(false); }} className="text-sm text-neutral-500 hover:text-neutral-800">
            Fechar
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Data de início</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Data de fim</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black" />
            </div>
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
        </div>

        <div className="p-4 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
          <button type="button" onClick={() => { reset(); setOpen(false); }} className="text-sm px-4 py-2 rounded-xl border border-neutral-300 text-neutral-900 hover:bg-neutral-50">
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
