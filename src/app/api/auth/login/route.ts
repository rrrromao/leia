import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const ok = password === (process.env.APP_PASSWORD || 'leia2026')
    if (!ok) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
    }
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    const res = NextResponse.json({ ok: true })
    res.cookies.set('leia_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
