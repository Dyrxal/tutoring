export function httpsRedirectUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const hostname = url.hostname.replace(/\.$/, '');
  if (url.protocol !== 'http:' || !['notationeducation.online', 'www.notationeducation.online'].includes(hostname)) {
    return null;
  }
  url.protocol = 'https:';
  url.hostname = hostname;
  url.port = '';
  url.username = '';
  url.password = '';
  return url.href;
}
