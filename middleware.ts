import { NextResponse, type NextRequest } from 'next/server';
import { httpsRedirectUrl } from './lib/https-redirect';

export function middleware(request: NextRequest) {
  const destination = httpsRedirectUrl(request.url);
  return destination ? NextResponse.redirect(destination, 308) : NextResponse.next();
}
