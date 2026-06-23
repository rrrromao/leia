import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const doi = searchParams.get('doi')

  if (!doi) {
    return NextResponse.json({ error: 'DOI obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
      { headers: { Accept: 'application/json' } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'DOI não encontrado' }, { status: 404 })
    }

    const data = (await res.json()) as any
    const msg = data.message

    const authors = msg.author
      ?.map((a: any) => `${a.given ?? ''} ${a.family ?? ''}`.trim())
      .filter(Boolean)
      .join(', ') ?? null

    const year =
      msg.published?.['date-parts']?.[0]?.[0] ??
      msg.issued?.['date-parts']?.[0]?.[0] ??
      null

    const bookTitle = msg['container-title']?.[0] ?? msg['collection-title'] ?? null
    const publisher = msg.publisher ?? null

    return NextResponse.json({
      title: msg.title?.[0] ?? null,
      authors: authors || null,
      year: year ? Number(year) : null,
      journal: msg['container-title']?.[0] ?? null,
      bookTitle,
      publisher,
      url: msg.URL ?? null,
      doi: msg.DOI ?? doi,
      abstract: msg.abstract
        ? msg.abstract.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim()
        : null,
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar DOI' }, { status: 500 })
  }
}
