import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const items = await prisma.article.findMany({ orderBy: { addedAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const item = await prisma.article.create({ data })
    return NextResponse.json(item)
  } catch (e) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}
