import React from 'react'
import type { TRestrictions } from '@site/src/customTypes/restrictions'

export const RESTRICTIONS: TRestrictions = {
  name: [
    '[S] Длина: от 1 до 63 символов.',
    '[S] Допустимы только строчные латинские буквы (a-z), цифры (0-9) и дефис (-).',
    '[S] Не может начинаться или заканчиваться дефисом.',
    <>[S] Регулярное выражение: <code>{'^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'}</code>.</>,
    <>[S] Валидация пропускается, если значение пустое: <code>IGNORE_IF_ZERO_VALUE</code>.</>,
  ],

  namespace: [
    <>[S] Те же ограничения, что и для <code>name</code>: длина 1-63 символа, lowercase, regex.</>,
    <>[S] Поле опционально: <code>field_behavior = OPTIONAL</code>.</>,
    <>[R] Для большинства namespaced-ресурсов namespace должен быть задан как часть корректной бизнес-модели.</>,
  ],

  uid: [
    '[S] Поле описано как UUID в OpenAPI/REST-контракте.',
    <>[S] Канонический паттерн: <code>{'^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'}</code>.</>,
    '[R] Парсер API принимает hex-символы в любом регистре, но в ответах обычно используется канонический формат.',
    '[R] При создании обычно не указывается и генерируется сервером.',
    '[R] При update/delete используется для идентификации ресурса.',
  ],

  displayName: [
    <>[S] Максимальная длина: 63 символа (<code>string.max_len: 63</code>).</>,
    '[S] Необязательное поле.',
  ],

  comment: [
    '[S] Необязательное поле.',
    '[R] Произвольная строка, явных прикладных ограничений длины нет.',
    <>[DB] Хранится в БД как PostgreSQL <code>TEXT</code>.</>,
  ],

  description: [
    '[S] Необязательное поле.',
    '[R] Произвольная строка, явных прикладных ограничений длины нет.',
    <>[DB] Хранится в БД как PostgreSQL <code>TEXT</code>.</>,
  ],

  action: [
    '[S] Обязательное поле.',
    <>[S] Допустимые значения: <code>ALLOW</code>, <code>DENY</code>.</>,
    <>[S] На уровне API/контракта значение <code>UNKNOWN</code> считается недопустимым.</>,
  ],

  traffic: [
    <>[S] Допустимые значения: <code>BOTH</code>, <code>INGRESS</code>, <code>EGRESS</code>.</>,
    '[S] Необязательное поле.',
    <>[R] Семантика: <code>INGRESS</code> - вход к local, <code>EGRESS</code> - выход от local, <code>BOTH</code> - <code>EGRESS</code> со встречным доступом.</>,
  ],

  protocol: [
    <>[S] Допустимые значения: <code>TCP</code>, <code>UDP</code>, <code>ICMP</code>.</>,
    <>[R] Выбранный протокол определяет допустимые поля в <code>Transport.Entry</code>.</>,
  ],

  ipv: [
    <>[S] Допустимые значения: <code>IPV4</code> и <code>IPV6</code>.</>,
    <>[R] Определяет семейство IP-адресов для transport-конфигурации.</>,
  ],

  endpointType: [
    <>[S] Допустимые значения: <code>ADDRESS_GROUP</code>, <code>SERVICE</code>, <code>FQDN</code>, <code>CIDR</code>.</>,
    <>[R] Для <code>local</code> допустимы только <code>ADDRESS_GROUP</code> и <code>SERVICE</code>.</>,
    <>[R] Для <code>remote</code> допустимы все четыре типа.</>,
    <>[R] Для <code>ADDRESS_GROUP</code> и <code>SERVICE</code> используются <code>name</code> + <code>namespace</code>.</>,
    <>[R] Для <code>FQDN</code> и <code>CIDR</code> обязательно поле <code>value</code>.</>,
    <>[R] Для <code>FQDN</code> и <code>CIDR</code> проверка существования ресурса не выполняется.</>,
  ],

  cidr: [
    <>[S] Обязательное поле: <code>string.min_len: 1</code>.</>,
    <>[S] Не должно содержать пробелов в начале или конце: <code>this == this.trim()</code>.</>,
    <>[S] Должно содержать символ <code>/</code>: <code>{"this.contains('/')"}</code>.</>,
    <>[R] Значение должно быть каноничным CIDR-представлением сети, например <code>10.0.0.0/16</code> или <code>::1/128</code>.</>,
  ],

  fqdn: [
    <>[S] Используется как строковое значение endpoint при <code>type = FQDN</code>.</>,
    <>[R] Должно содержать полное доменное имя, например <code>example.com</code>.</>,
    '[R] Резолвится агентом в IP-адреса при применении правил.',
  ],

  ports: [
    <>[S] Поле имеет тип <code>string</code>.</>,
    <>[R] Применимо только для протоколов <code>TCP</code> и <code>UDP</code>.</>,
    <>[R] Поддерживаются одиночные порты, диапазоны портов и списки через запятую.</>,
    <>[R] Для <code>ICMP</code> использование <code>ports</code> недопустимо.</>,
  ],

  icmpType: [
    <>[S] На уровне wire-format поле передается как <code>uint32</code>.</>,
    <>[R] Фактически допустимый диапазон значений: <code>0..255</code>.</>,
    <>[R] Примеры: <code>0</code> - echo-reply, <code>8</code> - echo-request, <code>3</code> - destination-unreachable.</>,
    <>[R] Применимо только для протокола <code>ICMP</code>.</>,
    <>[R] Для <code>TCP</code> и <code>UDP</code> использование ICMP types недопустимо.</>,
  ],

  selectors: [
    <>[S] Массив обязателен: <code>required: true</code>.</>,
    <>[S] Каждый селектор может содержать <code>fieldSelector</code>, <code>labelSelector</code> или оба поля сразу.</>,
    <>[R] Внутри одного селектора <code>fieldSelector</code> + <code>labelSelector</code> объединяются через логическое <code>AND</code>.</>,
    <>[R] Между селекторами в массиве применяется логическое <code>OR</code>.</>,
    <>[R] Если в <code>fieldSelector.refs[]</code> указано несколько элементов, ресурс должен соответствовать всем из них.</>,
  ],

  metadataRequired: [
    <>[S] Поле <code>metadata</code> обязательно: <code>required: true</code>.</>,
    <>[S] Поле <code>spec</code> обязательно: <code>required: true</code>.</>,
  ],

  upsertBatch: [
    <>[S] Массив ресурсов обязателен: <code>REQUIRED</code>.</>,
    <>[S] Минимум один элемент: <code>repeated.min_items: 1</code>.</>,
  ],

  deleteNamespace: [
    <>[S] CEL-условие: <code>{"this.uid != '' || this.name != ''"}</code>.</>,
    <>[S] Необходимо указать <code>uid</code> или <code>name</code>.</>,
  ],

  deleteWithNamespace: [
    <>[S] CEL-условие: <code>{"this.uid != '' || (this.name != '' && this.namespace != '')"}</code>.</>,
    <>[S] Необходимо указать <code>uid</code> или комбинацию <code>name</code> + <code>namespace</code>.</>,
  ],

  addressGroupRef: [
    <>[S] Поле <code>addressGroup</code> обязательно: <code>required: true</code>.</>,
    <>[R] Для корректной ссылки должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>[R] Ресурс <code>AddressGroup</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
  ],

  hostRef: [
    <>[S] Поле <code>host</code> обязательно: <code>required: true</code>.</>,
    <>[R] Для корректной ссылки должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>[R] Ресурс <code>Host</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
  ],

  networkRef: [
    <>[S] Поле <code>network</code> обязательно: <code>required: true</code>.</>,
    <>[R] Для корректной ссылки должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>[R] Ресурс <code>Network</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
  ],

  serviceRef: [
    <>[S] Поле <code>service</code> обязательно: <code>required: true</code>.</>,
    <>[R] Для корректной ссылки должны быть указаны <code>name</code> и <code>namespace</code>.</>,
    <>[R] Ресурс <code>Service</code> с указанными <code>name</code> и <code>namespace</code> должен существовать на момент создания связи.</>,
    <>[DB] Не допускается пересечение transport-настроек с уже привязанными сервисами той же <code>AddressGroup</code>.</>,
  ],
}