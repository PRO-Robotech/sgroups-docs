import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'SGroups',
  tagline: 'Host Based NGFW — управление сетевыми группами безопасности',
  favicon: 'img/favicon.ico',

  url: 'https://sgroups.prorobotech.ru',
  baseUrl: '/',
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    navbar: {
      title: 'SGroups',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'techDocs',
          position: 'left',
          label: 'Техническая документация',
        },
        {
          href: 'https://github.com/PRO-Robotech',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} ООО «ПРТ». Все права защищены.`,
      links: [
        {
          title: 'Документация',
          items: [
            { label: 'Введение', to: '/' },
            { label: 'API', to: '/api/overview' },
          ],
        },
        {
          title: 'Репозитории',
          items: [
            { label: 'sgroups', href: 'https://github.com/PRO-Robotech/sgroups' },
            { label: 'sgroups-proto', href: 'https://github.com/PRO-Robotech/sgroups-proto' },
            { label: 'sgroups-k8s-api', href: 'https://github.com/PRO-Robotech/sgroups-k8s-api' },
          ],
        },
        {
          title: 'Контакты',
          items: [
            { label: 'Telegram', href: 'https://t.me/sgroups_support' },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'protobuf', 'yaml', 'sql', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
