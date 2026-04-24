import React from 'react'
import type { TRestrictions } from '@site/src/customTypes/restrictions'

export const RESTRICTIONS: TRestrictions = {
  name: [
    'Длина: от 1 до 63 символов.',
    'Допустимы только строчные латинские буквы (a–z), цифры (0–9) и дефис (-).',
    'Не может начинаться или заканчиваться дефисом.',
    <>Регулярное выражение: <code>{'^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'}</code>.</>,
    <>Валидация пропускается, если значение пустое: <code>IGNORE_IF_ZERO_VALUE</code>.</>,
  ],

  namespace: [
    <>Те же ограничения, что и для <code>name</code>: длина 1–63 символа, lowercase, regex.</>,
    <>Поле опционально: <code>field_behavior = OPTIONAL</code>.</>,
    <>Обязательно для всех ресурсов, кроме <code>Namespace</code>.</>,
  ],

  uid: [
    'Формат UUID v4.',
    <>Канонический паттерн: <code>{'^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'}</code>.</>,
    'Парсер API принимает hex-символы в любом регистре, но в ответах обычно используется канонический формат.',
    'При создании не указывается — генерируется сервером.',
    'При обновлении обязателен для идентификации ресурса.',
  ],

  displayName: [
    <>Максимальная длина: 63 символа (<code>string.max_len: 63</code>).</>,
    'Необязательное поле.',
  ],

  comment: [
    'Необязательное поле.',
    'Произвольная строка, явных ограничений длины на уровне API нет.',
    <>Хранится в БД как PostgreSQL <code>TEXT</code>.</>,
  ],

  description: [
    'Необязательное поле.',
    'Произвольная строка, явных ограничений длины на уровне API нет.',
    <>Хранится в БД как PostgreSQL <code>TEXT</code>.</>,
  ],

  action: [
    'Обязательное поле.',
    <>Допустимые значения: <code>ALLOW</code> (1), <code>DENY</code> (2).</>,
    <>Значение <code>UNKNOWN</code> (0) запрещено: <code>enum.not_in: [0]</code>.</>,
  ],

  traffic: [
    <>Допустимые значения: <code>BOTH</code>, <code>INGRESS</code>, <code>EGRESS</code>.</>,
    'Необязательное поле.',
  ],

  protocol: [
    <>Допустимые значения: <code>TCP</code> (1), <code>UDP</code> (2), <code>ICMP</code> (3).</>,
  ],

  ipv: [
    <>Допустимые значения: <code>IPV4</code> и <code>IPV6</code>.</>,
  ],

  endpointType: [
    <>Допустимые значения: <code>ADDRESS_GROUP</code> (1), <code>SERVICE</code> (2), <code>FQDN</code> (3), <code>CIDR</code> (4).</>,
    <>Для <code>local</code> допустимы только <code>ADDRESS_GROUP</code> и <code>SERVICE</code>.</>,
    <>Для <code>remote</code> допустимы все четыре типа.</>,
    <>Для типов <code>ADDRESS_GROUP</code> и <code>SERVICE</code> ресурс с указанными <code>name</code> и <code>namespace</code> должен существовать.</>,
    <>Для типов <code>FQDN</code> и <code>CIDR</code> проверка существования ресурса не выполняется, но обязательно поле <code>value</code>.</>,
  ],

  cidr: [
    <>Обязательное поле: <code>string.min_len: 1</code>.</>,
    <>Не должно содержать пробелов в начале или конце: <code>this == this.trim()</code>.</>,
    <>Должно содержать символ <code>/</code>: <code>{"this.contains('/')"}</code>.</>,
    <>Формат: <code>IP/маска</code>, например <code>10.0.0.0/16</code> или <code>::1/128</code>.</>,
  ],

  fqdn: [
    <>Полное доменное имя, например <code>example.com</code>.</>,
    'Резолвится агентом в IP-адреса при применении правил.',
  ],

  ports: [
    <>Одиночный порт: <code>80</code>.</>,
    <>Диапазон портов: <code>8080-8090</code>.</>,
    <>Список через запятую: <code>80,443,8080</code>.</>,
    <>Применимо только для протоколов <code>TCP</code> и <code>UDP</code>.</>,
  ],

  icmpType: [
    <>Целое число <code>uint32</code> — код типа ICMP-сообщения.</>,
    <>Фактически допустимый диапазон значений: <code>0..255</code>.</>,
    <>Примеры: <code>0</code> — echo-reply, <code>8</code> — echo-request, <code>3</code> — destination-unreachable.</>,
    <>Применимо только для протокола <code>ICMP</code>.</>,
  ],

  selectors: [
    <>Массив обязателен: <code>required: true</code>.</>,
    <>Каждый селектор может содержать <code>fieldSelector</code>, <code>labelSelector</code> или оба поля сразу.</>,
    <>Внутри одного селектора <code>fieldSelector</code> + <code>labelSelector</code> объединяются через логическое <code>AND</code>.</>,
    <>Между селекторами в массиве применяется логическое <code>OR</code>.</>,
  ],

  metadataRequired: [
    <>Поле <code>metadata</code> обязательно: <code>required: true</code>.</>,
    <>Поле <code>spec</code> обязательно: <code>required: true</code>.</>,
  ],

  upsertBatch: [
    <>Массив ресурсов обязателен: <code>REQUIRED</code>.</>,
    <>Минимум один элемент: <code>repeated.min_items: 1</code>.</>,
  ],

  deleteNamespace: [
    <>CEL-условие: <code>{"this.uid != '' || this.name != ''"}</code>.</>,
    <>Необходимо указать <code>uid</code> или <code>name</code>.</>,
  ],

  deleteWithNamespace: [
    <>CEL-условие: <code>{"this.uid != '' || (this.name != '' && this.namespace != '')"}</code>.</>,
    <>Необходимо указать <code>uid</code> или комбинацию <code>name</code> + <code>namespace</code>.</>,
  ],

  addressGroupRef: [
    <>Поле <code>addressGroup</code> обязательно: <code>required: true</code>.</>,
    <>Должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>Ресурс <code>AddressGroup</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
  ],

  hostRef: [
    <>Поле <code>host</code> обязательно: <code>required: true</code>.</>,
    <>Должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>Ресурс <code>Host</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
  ],

  networkRef: [
    <>Поле <code>network</code> обязательно: <code>required: true</code>.</>,
    <>Должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>Ресурс <code>Network</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
  ],

  serviceRef: [
    <>Поле <code>service</code> обязательно: <code>required: true</code>.</>,
    <>Должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>Ресурс <code>Service</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
    <>Порты и протоколы <code>Service</code> не должны пересекаться с портами и протоколами других <code>Service</code>, уже привязанных к этой <code>AddressGroup</code>.</>,
  ],
}