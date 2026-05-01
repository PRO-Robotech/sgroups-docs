import React from 'react'

type ValidationGroup = {
  label: string
  rules: React.ReactNode[]
}

export type K8sOperation = 'list' | 'get' | 'create' | 'put' | 'patch' | 'delete'

const K8S_LEVEL = 'Уровень k8s-сервера'

export const K8S_VALIDATIONS: Record<K8sOperation, ValidationGroup[]> = {
  list: [
    {
      label: K8S_LEVEL,
      rules: [
        <>Существование namespace (для namespaced-запросов).</>,
        <>Корректность <code>?labelSelector</code>, <code>?fieldSelector</code>, <code>?limit</code>, <code>?continue</code>, <code>?watch</code>.</>,
        <>Авторизация: RBAC <code>get</code> / <code>list</code> / <code>watch</code> на <code>sgroups.io</code>.</>,
      ],
    },
  ],
  get: [
    {
      label: K8S_LEVEL,
      rules: [
        <>Существование namespace и объекта с заданным <code>metadata.name</code>.</>,
        <>Авторизация: RBAC <code>get</code> на конкретный ресурс / namespace.</>,
      ],
    },
  ],
  create: [
    {
      label: K8S_LEVEL,
      rules: [
        <>Корректный <code>apiVersion: sgroups.io/v1alpha1</code> и <code>kind</code>.</>,
        <>Имя объекта <code>metadata.name</code> соответствует RFC 1123 (DNS-subdomain).</>,
        <>Объект с таким именем ещё не существует в namespace — иначе <code>AlreadyExists</code> (409).</>,
        <>Поддерживаемый <code>Content-Type</code>: <code>application/json</code> или <code>application/yaml</code>.</>,
        <>Авторизация: RBAC <code>create</code> на ресурс / namespace.</>,
      ],
    },
  ],
  put: [
    {
      label: K8S_LEVEL,
      rules: [
        <>Объект существует — иначе <code>NotFound</code> (404).</>,
        <>Свежий <code>metadata.resourceVersion</code> — устаревший приведёт к <code>Conflict</code> (409, optimistic concurrency).</>,
        <>Корректный <code>apiVersion</code>, <code>kind</code>, <code>metadata.name</code> совпадает с URL.</>,
        <>Авторизация: RBAC <code>update</code>.</>,
      ],
    },
  ],
  patch: [
    {
      label: K8S_LEVEL,
      rules: [
        <>Объект существует — иначе <code>NotFound</code> (404).</>,
        <>Поддерживаемый <code>Content-Type</code>: <code>application/strategic-merge-patch+json</code>, <code>application/merge-patch+json</code> или <code>application/json-patch+json</code>.</>,
        <>Авторизация: RBAC <code>patch</code>.</>,
      ],
    },
  ],
  delete: [
    {
      label: K8S_LEVEL,
      rules: [
        <>Объект существует — иначе <code>NotFound</code> (404).</>,
        <>Опции <code>?gracePeriodSeconds</code>, <code>?propagationPolicy</code>, <code>?dryRun</code> валидны.</>,
        <>Авторизация: RBAC <code>delete</code>.</>,
      ],
    },
  ],
}
