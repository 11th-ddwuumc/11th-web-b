export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const endpoint = (await params).path.join('/');
  if (!/^(?:movie\/(?:popular|[1-9][0-9]*)|search\/movie)$/.test(endpoint)) {
    return Response.json({ message: 'Unknown movie endpoint' }, { status: 404 });
  }
  const base = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return Response.json({ message: 'TMDB is not configured' }, { status: 503 });

  try {
    const upstream = new URL(`${base.replace(/\/+$/, '')}/${endpoint}`);
    const incoming = new URL(request.url).searchParams;
    for (const key of ['query', 'page', 'language', 'include_adult']) {
      const value = incoming.get(key);
      if (value !== null) upstream.searchParams.set(key, value);
    }
    const result = await fetch(upstream, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
      redirect: 'error',
    });
    if (!result.ok) return Response.json({ message: 'TMDB request failed' }, { status: result.status });
    return Response.json(await result.json());
  } catch {
    return Response.json({ message: 'TMDB is unavailable' }, { status: 502 });
  }
}
