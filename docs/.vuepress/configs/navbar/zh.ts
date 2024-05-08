import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta.js'

export const navbarZh: NavbarConfig = [
  {
    text: '首页',
    link: '/zh/',
  },
  {
    text: 'pvpn',
    link: '/zh/pvpn/',
    children: [
      {
      text: '快速开始',
      link: '/zh/pvpn/get-started.md',
      },
    ],
  },
  {
    text: 'deyaio',
    link: '/zh/deyaio/',
    children: [
      {
      text: '快速开始',
      link: '/zh/deyaio/get-started.md'
      },
      {
      text: '简介',
      link: '/zh/deyaio/introduction.md'
      },
    ],
  },
]
