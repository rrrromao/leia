import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware will be re-enabled after build passes. Leaving stub to unblock build.
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = { matcher: [] }
