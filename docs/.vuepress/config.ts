import { defineUserConfig } from 'vuepress';
import { hopeTheme } from 'vuepress-theme-hope';
import { searchPlugin } from '@vuepress/plugin-search';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';

export default defineUserConfig({
  title: `Yueng's Blog`,
  description: 'Yueng的个人博客',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],

  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索',
        },
        '/en/': {
          placeholder: 'Search',
        },
      },
    }),
    googleAnalyticsPlugin({
      id: 'G-LBZVD4X9TV',
    }),
  ],
  theme: hopeTheme({
    author: 'YuengFu',
    logo: '/logo.png',

    repo: 'https://github.com/TohckyToki/TohckyToki.github.io',
    docsRepo: 'https://github.com/TohckyToki/TohckyToki.github.io',
    docsBranch: 'src',
    docsDir: '/docs',
    editLink: false,

    displayFooter: true,
    copyright: 'Copyright © 2019-2022 YuengFu',

    sidebar: false,

    navbar: [
      {
        text: "博客",
        link: "/category/blog/",
        activeMatch: "^/_blogs",
      },
      {
        text: "工具",
        link: "/category/tool/",
        activeMatch: "^/_tools",
      },
    ],

    themeColor: {
      blue: "#2196f3",
      red: "#f26d6d",
      green: "#3eaf7c",
      orange: "#fb9b5f",
    },

    fullscreen: true,

    plugins: {
      blog: {
        autoExcerpt: true,
      },
      mdEnhance: {
        tabs: true,
        mermaid: true,
        sub: true,
        sup: true,
        codetabs: true,
        tasklist: true,
        mark: true,
        footnote: true,
        container: true,
      },
      copyCode: {},
      comment: {
        provider: 'Giscus',
        repo: 'TohckyToki/TohckyToki.github.io',
        repoId: 'R_kgDOHlVTMg',
        category: 'Announcements',
        categoryId: 'DIC_kwDOHlVTMs4CP-NF',
      },
    },

    blog: { 
      name: 'Yueng',
      description: 'Per aspera, ad astra.',
      intro: '/about',
      articlePerPage: 20,
      timeline: '往日不再',
      medias: {
        GitHub: "https://github.com/TohckyToki",
        Email: "yuengfu.v@outlook.com",
        Gmail: "yuengfu.v@gmail.com",
      }
    }
  }),
});