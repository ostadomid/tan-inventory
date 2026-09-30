import React from 'react'

import {
  LogIn,
  User,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  LifeBuoy,
  Menu,
  ChevronDown,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'

interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
}

interface HeaderProps {
  isLoggedIn?: boolean
  user?: UserProfile
  onLogin?: () => void
  onLogout?: () => void
}

const navLinks = [
  { title: 'Home', to: '/' },
  { title: 'Features', href: '/features' },
]

export function Header({
  isLoggedIn = false,
  user = {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  onLogin,
  onLogout,
}: HeaderProps) {
  // Mobile menu toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Helper to extract initials for avatar fallback
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= 1. Left: Brand / Logo ================= */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Acme Corp
            </span>
          </Link>
        </div>

        {/* ================= 2. Center: Navigation Links (Desktop) ================= */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* ================= 3. Right: Auth Actions ================= */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            /* User Dropdown Menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="hidden text-sm font-medium lg:inline-block">
                    {user.name}
                  </span>
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 mt-2" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing & Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged Out State: Login Button */
            <Button
              onClick={onLogin}
              className="gap-2 font-medium shadow-sm transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>Log in</span>
            </Button>
          )}

          {/* Mobile hamburger menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* ================= Mobile Menu Drawer (Dropdown) ================= */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
