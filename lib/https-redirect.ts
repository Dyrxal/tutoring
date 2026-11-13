export function httpsRedirectUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' || !['notationeducation.online', 'www.notationeducation.online'].includes(url.hostname)) {
    return null;
  }
  url.protocol = 'https:';
  url.port = '';
  url.username = '';
  url.password = '';
  return url.href;
}
