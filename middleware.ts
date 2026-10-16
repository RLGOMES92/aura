import { NextResponse, type NextRequest } from "next/server";

// Basic Auth para /admin. Sem ADMIN_USER/ADMIN_PASS definidos, bloqueia tudo.
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER, pass = process.env.ADMIN_PASS;
  if (!user || !pass) return new NextResponse("Admin não configurado", { status: 503 });
  const auth = req.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ") && atob(auth.slice(6)) === `${user}:${pass}`) return NextResponse.next();
  return new NextResponse("Autenticação necessária", {
    status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
}
export const config = { matcher: ["/admin/:path*"] };
