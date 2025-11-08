export async function fetchOgImage(pageUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Upgrade-Insecure-Requests': '1'
      }
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const html = await res.text()

    // Try several common meta patterns
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
      /<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    ]
    const decodeHtml = (s: string) =>
      s.replace(/&amp;/g, '&')
       .replace(/&quot;/g, '"')
       .replace(/&#39;/g, "'")
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
    for (const rx of patterns) {
      const m = html.match(rx)
      if (m && m[1]) {
        let url = decodeHtml(m[1])
        if (url.startsWith('//')) url = 'https:' + url
        return url
      }
    }
    return null
  } catch {
    return null
  }
}


