import React from 'react'
import type { TRestrictions } from '@site/src/customTypes/restrictions'

export const RESTRICTIONS: TRestrictions = {
  name: [
    'Длина от 1 до 63 символов',
    'Только строчные латинские буквы (a-z), цифры (0-9) и дефис (-)',
    'Не может начинаться или заканчиваться дефисом',
    <>Регулярное выражение: <code>{'`^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$`'}</code></>,
    'Валидация пропускается, если значение пустое (ignore: IGNORE_IF_ZERO_VALUE)',
  ],
  namespace: [
    'Те же ограничения, что и для name (1–63, lowercase, regex)',
    'Поле опционально (field_behavior = OPTIONAL)',
    'Обязательно для всех ресурсов, кроме Namespace',
  ],
  uid: [
    'Формат UUID v4 (uppercase hex)',
    <>Паттерн: <code>{'`^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$`'}</code></>,
    'При создании не указывается — генерируется сервером',
    'При обновлении — обязателен для идентификации ресурса',
  ],
  displayName: [
    <>Максимальная длина 63 символа (<code>string.max_len: 63</code>)</>,
    'Необязательное поле',
  ],
  action: [
    'Обязательное поле',
    <>Допустимые значения: <code>ALLOW</code> (1), <code>DENY</code> (2)</>,
    <>Значение <code>UNKNOWN</code> (0) запрещено (<code>enum.not_in: [0]</code>)</>,
  ],
  traffic: [
    <>Допустимые значения: <code>BOTH</code> (1), <code>INGRESS</code> (2), <code>EGRESS</code> (3)</>,
    'Необязательное поле',
  ],
  protocol: [
    <>Допустимые значения: <code>TCP</code> (1), <code>UDP</code> (2), <code>ICMP</code> (3)</>,
  ],
  ipv: [
    <>Допустимые значения: <code>IPv4</code> (1), <code>IPv6</code> (2)</>,
  ],
  endpointType: [
    <>Допустимые значения: <code>ADDRESS_GROUP</code> (1), <code>SERVICE</code> (2), <code>FQDN</code> (3), <code>CIDR</code> (4)</>,
    <>Для local: допустимы <code>ADDRESS_GROUP</code> и <code>SERVICE</code></>,
    <>Для remote: допустимы все четыре типа</>,
    <>При типе <code>ADDRESS_GROUP</code> или <code>SERVICE</code> — ресурс с указанным name и namespace должен существовать</>,
    <>При типе <code>FQDN</code> или <code>CIDR</code> — проверка существования не выполняется, обязательно поле <code>value</code></>,
  ],
  cidr: [
    <>Обязательное поле (<code>string.min_len: 1</code>)</>,
    <>Не должно содержать пробелов в начале/конце (CEL: <code>this == this.trim()</code>)</>,
    <>Обязательно наличие символа <code>/</code> (CEL: <code>{"this.contains('/')"}</code>)</>,
    'Формат: IP/маска (например, 10.0.0.0/16 или ::1/128)',
  ],
  fqdn: [
    'Полное доменное имя (например, example.com)',
    'Резолвится агентом в IP-адреса при применении правил',
  ],
  ports: [
    'Одиночный порт: "80"',
    'Диапазон: "8080-8090"',
    'Список через запятую: "80,443,8080"',
    'Применимо только для протоколов TCP и UDP',
  ],
  icmpType: [
    'Целое число (uint32) — код типа ICMP-сообщения',
    'Примеры: 0 (echo-reply), 8 (echo-request), 3 (destination-unreachable)',
    'Применимо только для протокола ICMP',
  ],
  selectors: [
    <>Массив обязателен (<code>required: true</code>)</>,
    'Каждый селектор может содержать fieldSelector и/или labelSelector',
    'Внутри одного селектора fieldSelector + labelSelector — логическое И (AND)',
    'Между селекторами в массиве — логическое ИЛИ (OR)',
  ],
  metadataRequired: [
    <>Поле <code>metadata</code> обязательно (<code>required: true</code>)</>,
    <>Поле <code>spec</code> обязательно (<code>required: true</code>)</>,
  ],
  upsertBatch: [
    <>Массив ресурсов обязателен (<code>REQUIRED</code>)</>,
    <>Минимум 1 элемент (<code>repeated.min_items: 1</code>)</>,
  ],
  deleteNamespace: [
    <>CEL: <code>{"this.uid != '' || this.name != ''"}</code></>,
    'Необходимо указать uid ИЛИ name',
  ],
  deleteWithNamespace: [
    <>CEL: <code>{"this.uid != '' || (this.name != '' && this.namespace != '')"}</code></>,
    'Необходимо указать uid ИЛИ комбинацию name + namespace',
  ],
  addressGroupRef: [
    <>Поле <code>addressGroup</code> обязательно (<code>required: true</code>)</>,
    'Должны быть указаны name и namespace',
    'Ресурс AddressGroup с указанным name и namespace должен существовать на момент создания связи',
  ],
  hostRef: [
    <>Поле <code>host</code> обязательно (<code>required: true</code>)</>,
    'Должны быть указаны name и namespace',
    'Ресурс Host с указанным name и namespace должен существовать на момент создания связи',
  ],
  networkRef: [
    <>Поле <code>network</code> обязательно (<code>required: true</code>)</>,
    'Должны быть указаны name и namespace',
    'Ресурс Network с указанным name и namespace должен существовать на момент создания связи',
  ],
  serviceRef: [
    <>Поле <code>service</code> обязательно (<code>required: true</code>)</>,
    'Должны быть указаны name и namespace',
    'РесурсService с указанным name и namespace должен существовать на момент создания связи',
  ],
}
