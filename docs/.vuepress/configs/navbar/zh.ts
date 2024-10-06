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
      text: '简介',
      link: '/zh/pvpn/introduction.md'
      },

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
      text: '简介',
      link: '/zh/deyaio/introduction.md'
      },

      {
      text: '快速开始',
      link: '/zh/deyaio/get-started.md'
      },

      {
      text: 'meta-custom',
      link: '/zh/deyaio/meta-custom.md'
      },

      {
      text: 'ROS2支持',
      link: '/zh/deyaio/ros2.md'
      },

      {
        text: 'Mono支持',
        link: '/zh/deyaio/mono.md'
        },

    ],
  },
]
