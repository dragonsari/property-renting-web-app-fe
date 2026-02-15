"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { useAuthStore } from "@/stores/auth.store"
import { usePathname } from "next/navigation"

export const HeroHeader = () => {
  const { role, isVerified, logout } = useAuthStore()
  const pathname = usePathname()

  const [menuState, setMenuState] = React.useState(false)


  React.useEffect(() => {
    setMenuState(false)
  }, [pathname])

  const menuItems = [
    ...(isVerified ? [{ name: "Profile", href: "/profile" }] : []),
    ...(isVerified && role === "TENANT"
      ? [{ name: "Dashboard", href: "/tenant/properties" }]
      : []),
  ]

  return (
    <header className="relative z-50">
      <nav
        className="fixed top-4 inset-x-0 z-50"
      >

        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-full border bg-background/80 px-6 py-3 shadow-lg backdrop-blur-xl">
            
            
            <Link
              href="/"
              aria-label="home"
              className="flex items-center gap-2"
            >
              <Logo />
            </Link>

            
            <div className="hidden items-center gap-8 lg:flex">
              <ul className="flex items-center gap-6 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3">
                {isVerified ? (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/login/user">Login</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/RegisterUser">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>


            <button
              onClick={() => setMenuState((prev) => !prev)}
              aria-label="Toggle Menu"
              className="lg:hidden"
            >
              {menuState ? <X /> : <Menu />}
            </button>
          </div>

          
          {menuState && (
            <div className="mt-3 lg:hidden">
              <div className="rounded-2xl border bg-background p-6 shadow-xl">
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="block text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3">
                  {isVerified ? (
                    <Button
                    className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        logout()
                        setMenuState(false)
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login/user">Login</Link>
                      </Button>
                      <Button asChild >
                        <Link href="/RegisterUser">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
