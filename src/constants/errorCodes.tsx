import type { TRespondsCodes } from '@site/src/customTypes/errorCodes'

export const RESPOND_CODES: TRespondsCodes = {
  ok: {
    grpcCode: 'OK',
    grpcNumber: '0',
    httpCode: '200',
    description: 'Успешное выполнение запроса',
  },
  invalidArgument: {
    grpcCode: 'INVALID_ARGUMENT',
    grpcNumber: '3',
    httpCode: '400',
    description: 'Некорректные параметры запроса (ошибка валидации)',
  },
  notFound: {
    grpcCode: 'NOT_FOUND',
    grpcNumber: '5',
    httpCode: '404',
    description: 'Ресурс не найден',
  },
  alreadyExists: {
    grpcCode: 'ALREADY_EXISTS',
    grpcNumber: '6',
    httpCode: '409',
    description: 'Ресурс с таким именем уже существует',
  },
  permissionDenied: {
    grpcCode: 'PERMISSION_DENIED',
    grpcNumber: '7',
    httpCode: '403',
    description: 'Недостаточно прав для выполнения операции',
  },
  unauthenticated: {
    grpcCode: 'UNAUTHENTICATED',
    grpcNumber: '16',
    httpCode: '401',
    description: 'Требуется аутентификация',
  },
  internal: {
    grpcCode: 'INTERNAL',
    grpcNumber: '13',
    httpCode: '500',
    description: 'Внутренняя ошибка сервера',
  },
}
