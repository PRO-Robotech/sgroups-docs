export type K8sCode = {
  httpCode: string
  reason: string
  description: string
}

export const K8S_RESPOND_CODES = {
  badRequest: {
    httpCode: '400',
    reason: 'BadRequest',
    description: 'Битый JSON / YAML или неподдерживаемая операция.',
  },
  unauthorized: {
    httpCode: '401',
    reason: 'Unauthorized',
    description: 'Отсутствует или невалиден токен / клиентский сертификат.',
  },
  forbidden: {
    httpCode: '403',
    reason: 'Forbidden',
    description: 'RBAC отверг операцию для текущей роли.',
  },
  notFound: {
    httpCode: '404',
    reason: 'NotFound',
    description: 'Запрошенный ресурс или namespace не существует.',
  },
  alreadyExists: {
    httpCode: '409',
    reason: 'AlreadyExists',
    description: 'Объект с таким именем уже есть в namespace.',
  },
  conflict: {
    httpCode: '409',
    reason: 'Conflict',
    description: 'Optimistic concurrency: устарел `metadata.resourceVersion`.',
  },
  invalid: {
    httpCode: '422',
    reason: 'Invalid',
    description: 'Валидация полей `spec` на стороне `sg-server` не прошла.',
  },
  internal: {
    httpCode: '500',
    reason: 'InternalError',
    description: 'Внутренняя ошибка `sgroups-k8s-api` или бэкенда.',
  },
  serviceUnavailable: {
    httpCode: '503',
    reason: 'ServiceUnavailable',
    description: 'Бэкенд `sg-server` недоступен (gRPC connect failed).',
  },
  timeout: {
    httpCode: '504',
    reason: 'Timeout',
    description: 'gRPC-вызов к `sg-server` превысил `grpc.timeout`.',
  },
} as const satisfies Record<string, K8sCode>
