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
      text: 'Introduction',
      link: '/pvpn/introduction',
      },
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
      text: 'Introduction',
      link: '/deyaio/introduction.md'
      },

      {
      text: 'Get Started',
      link: '/deyaio/get-started.md'
      },

      {
      text: 'meta-custom',
      link: '/deyaio/meta-custom.md'
      },

      {
      text: 'ROS2 Support',
      link: '/deyaio/ros2.md'
      },

    ],
  },
]
