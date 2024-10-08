import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/zh/pvpn/': [
    {
      text: 'pvpn',
      children: [
        '/zh/pvpn/get-started.md',
      ],
    },
  ],
  
  '/zh/deyaio/': [
    {
      text: 'deyaio',
      children: [
        '/zh/deyaio/introduction.md',
        '/zh/deyaio/get-started.md',
        '/zh/deyaio/meta-custom.md',
        '/zh/deyaio/ros2.md',
         '/zh/deyaio/mono.md'
      ],
    },
  ],
}
