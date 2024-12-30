import { NextResponse } from 'next/server';

const allowedHosts = process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',').map(host => host.trim().toLowerCase()) : [];

export async function middleware(req) {
  if (!req.nextUrl) {
    return NextResponse.next();
  }
  const host = req.headers.get('host').split(':')[0].toLowerCase();
  const service = decodeURIComponent(req.nextUrl.searchParams.get("service"));

  // Afficher l'hôte et le service dans la console pour débogage
  console.log('Host initiant la requête de redirection:', host);
  console.log('Service paramètre:', service);

  // Afficher les hôtes autorisés pour débogage
  console.log('Hôtes autorisés (ALLOWED_HOSTS):', allowedHosts);

  
  let serviceHost = null;
  try {
    const url = new URL(service);
    serviceHost = url.hostname.toLowerCase();
  } catch (error) {
    console.error('Erreur lors de l\'extraction du host du service:', error);
  }

  console.log('Hôte extrait du service:', serviceHost);

  if (req.nextUrl.pathname.startsWith('/api')) {
    if (allowedHosts.includes(host) && serviceHost && allowedHosts.includes(serviceHost)) {
      const res = NextResponse.next();
      res.cookies.set('service', service, { httpOnly: true, sameSite: 'strict' });
      return res;
    } else {
      console.log('Redirection vers /notAuthorized');
      return NextResponse.redirect(new URL('/notAuthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
