import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = ["/", "/r/"].some(path => nextUrl.pathname.startsWith(path))
    const isAuthRoute = nextUrl.pathname.startsWith("/login")

    if (isApiAuthRoute) return null

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/admin", nextUrl))
        }
        return null
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl))
    }

    return null
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
