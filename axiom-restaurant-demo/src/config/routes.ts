export const routes = {
  home: '/',
  menu: '/menu',
  about: '/about',
  reservations: '/reservations',
} as const

export type RoutePath = (typeof routes)[keyof typeof routes]

export interface NavItem {
  label: string
  path: RoutePath
}

export const navItems: NavItem[] = [
  { label: 'Home', path: routes.home },
  { label: 'Menu', path: routes.menu },
  { label: 'About', path: routes.about },
  { label: 'Reservations', path: routes.reservations },
]
