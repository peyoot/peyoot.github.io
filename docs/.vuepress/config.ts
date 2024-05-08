import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import {
  navbarEn,
  navbarZh,
  sidebarEn,
  sidebarZh,
} from './configs/index.js'


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
    repo: 'http://github.com/peyoot',
    docsDir: 'docs',
    lastUpdated: false
    contributors: false
    locales: {
      '/': {
	navbar: navbarEn,
        // sidebar
        sidebar: sidebarEn,

      },
      '/zh/': {

       navbar: navbarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
        // sidebar
        sidebar: sidebarZh,
        // page meta
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',
        // custom containers
        tip: '提示',
        warning: '注意',
        danger: '警告',
        // 404 page
        notFound: [
          '这里什么都没有',
          '我们怎么到这来了？',
          '这是一个 404 页面',
          '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',
        // a11y
        openInNewWindow: '在新窗口打开',
        toggleColorMode: '切换颜色模式',
        toggleSidebar: '切换侧边栏',

      },
    },

  }),
})
