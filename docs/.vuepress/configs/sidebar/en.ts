import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/pvpn/': [
    {
      text: 'pvpn',
      children: [
        '/pvpn/get-started.md',
      ],
    },
  ],
  
  '/deyaio/': [
    {
      text: 'deyaio',
      children: [
        '/deyaio/introduction.md',
        '/deyaio/get-started.md',
	'/deyaio/meta-custom.md',
	'/deyaio/ros2.md'
      ],
    },
  ],
}
