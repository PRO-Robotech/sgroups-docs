import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  techDocs: [
    'intro',
    {
      type: 'category',
      label: 'Установка',
      collapsed: false,
      items: [
        'install/server',
        'install/agent',
        'install/k8s',
      ],
    },
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: [
        'api/overview',
        'api/namespaces',
        'api/address-groups',
        'api/hosts',
        'api/networks',
        'api/services',
        'api/host-bindings',
        'api/network-bindings',
        'api/service-bindings',
        'api/uni-rule',
        'api/status',
      ],
    },
    {
      type: 'category',
      label: 'Конфигурация ресурсов',
      collapsed: false,
      items: [
        'resources/tenants',
        'resources/address-groups',
        'resources/networks',
        'resources/hosts',
        'resources/services',
        'resources/host-bindings',
        'resources/network-bindings',
        'resources/service-bindings',
        'resources/uni-rule',
      ],
    },
    {
      type: 'category',
      label: 'Дополнительно',
      collapsed: true,
      items: [
        'advanced/monitoring',
        'advanced/tls',
        'advanced/database',
      ],
    },
  ],
}

export default sidebars
