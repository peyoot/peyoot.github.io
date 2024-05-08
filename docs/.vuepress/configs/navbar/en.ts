import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta.js'

export const navbarEn: NavbarConfig = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'pvpn',
    link: '/pvpn/',
    children: [
      {
      text: 'Get Started',
      link: '/pvpn/get-started.md',
      },
    ],
  },
  {
    text: 'deyaio',
    link: '/deyaio/',
    children: [
      {
      text: 'Get Started',
      link: '/deyaio/get-started.md'
      },
      {
      text: 'Introduction',
      link: '/deyaio/introduction.md'
      },
    ],
  },
]
