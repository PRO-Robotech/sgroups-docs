import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  // server: REST/gRPC API + продвинутые темы
  serverSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Установка',
      collapsed: false,
      items: [
        'install/server-build',
        'install/server-config',
        'install/server-run',
        'install/server-tls',
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
      label: 'Дополнительно',
      collapsed: true,
      items: [
        'advanced/monitoring',
        'advanced/database',
      ],
    },
  ],

  // linux-agent: введение + установка + описание
  agentSidebar: [
    {
      type: 'category',
      label: 'Введение',
      collapsed: false,
      items: [
        'agent/overview',
      ],
    },
    {
      type: 'category',
      label: 'Установка',
      collapsed: false,
      items: [
        'install/agent-build',
        'install/agent-config',
        'install/agent-run',
      ],
    },
    {
      type: 'category',
      label: 'Описание',
      collapsed: false,
      items: [
        'agent/nft-layout',
        'agent/rule-mapping',
        'agent/annotations',
        'agent/lifecycle',
        'agent/sync',
        'agent/monitoring',
        'agent/troubleshooting',
      ],
    },
  ],

  // server-k8s: установка + Kubernetes Aggregated API
  k8sSidebar: [
    {
      type: 'category',
      label: 'Установка',
      collapsed: false,
      items: [
        'install/k8s-build',
        'install/k8s-config',
        'install/k8s-run',
      ],
    },
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: [
        'k8s-api/overview',
        'k8s-api/tenants',
        'k8s-api/address-groups',
        'k8s-api/networks',
        'k8s-api/hosts',
        'k8s-api/services',
        'k8s-api/host-bindings',
        'k8s-api/network-bindings',
        'k8s-api/service-bindings',
        'k8s-api/rules',
      ],
    },
  ],
}

export default sidebars
