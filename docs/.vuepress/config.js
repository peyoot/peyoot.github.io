import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({

// set site base to default value
  base: '/',
  locales: {
    '/': {
      lang: 'en-US',
  //    title: 'peyoot',
  //    description: 'Peyoot Chamber',
    },
    '/zh/': {
      lang: 'zh-CN',
  //    title: 'peyoot',
  //    description: '皮约特的魔法屋',
    },
  },
  bundler: viteBundler(),

// configure default theme
  theme: defaultTheme({
    hostname: 'https://peyoot.github.io',
//    logo: '/images/hero.png',
    repo: 'peyoot/peyoot.github.io',
    docsDir: 'docs',
    locales: {
      '/': {
        selectLanguageName: 'English',
        navbar: [
          {
            text: 'Home',
            link: '/',
         },
         {
            text: 'pvpn',
            link: '/pvpn/',
        },
        {
           text: 'deyaio',
           link: '/deyaio/',
        },

        ],
      },
      '/zh/': {
        selectLanguageName: '简体中文',
        navbar: [
          {
            text: '首页',
            link: '/',
          },
          {
            text: 'pvpn',
            link: '/pvpn/',
          },
          {
           text: 'deyaio',
           link: '/deyaio',
          },
        ],
      },
    },

  }),
})
