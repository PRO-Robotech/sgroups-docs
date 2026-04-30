import React from 'react'
import type { TRestrictions } from '@site/src/customTypes/restrictions'

export const RESTRICTIONS_DB: TRestrictions = {
  tbl_namespace: [
    <>Уникальный <code>uid</code>.</>,
    <>Уникальный <code>name</code>.</>,
    <>Поля <code>uid</code> и <code>name</code> неизменяемы после создания через <code>trg_namespace_immutable_fields</code>.</>,
  ],

  tbl_ag: [
    <>Уникальность пары <code>(name, ns)</code>.</>,
    <>Уникальный <code>uid</code>.</>,
    <>Каскадное удаление при удалении связанного namespace.</>,
    <>Поля <code>uid</code> и <code>name</code> неизменяемы после создания через <code>trg_ag_immutable_fields</code>.</>,
  ],

  tbl_network: [
    <>Уникальность пары <code>(name, ns)</code>.</>,
    <>Уникальный <code>uid</code>.</>,
    <>Поля <code>uid</code> и <code>name</code> неизменяемы после создания через <code>trg_network_immutable_fields</code>.</>,
  ],

  tbl_service: [
    <>Уникальность пары <code>(name, ns)</code>.</>,
    <>Уникальный <code>uid</code>.</>,
    <><code>entries_ports_no_overlap</code>: внутри <code>transports</code> не допускаются пересекающиеся диапазоны портов.</>,
    <><code>entries_icmp_no_overlap</code>: внутри <code>transports</code> не допускаются пересечения ICMP-типов.</>,
    <>Поля <code>uid</code> и <code>name</code> неизменяемы после создания через <code>trg_service_immutable_fields</code>.</>,
    <><code>trg_service_transport_overlap</code> запрещает обновить <code>transports</code>, если они начнут пересекаться с уже привязанными к тем же <code>AddressGroup</code> сервисами.</>,
  ],

  tbl_host_binding: [
    <>Уникальность пары <code>(ag, host)</code>.</>,
    <>Уникальность пары <code>(name, ns)</code>.</>,
    <>Поля <code>uid</code>, <code>name</code>, <code>ag</code> и <code>host</code> запрещены к изменению после создания.</>,
  ],

  tbl_network_binding: [
    <>Уникальность пары <code>(ag, network)</code>.</>,
    <>Уникальность пары <code>(name, ns)</code>.</>,
    <>Поля <code>uid</code>, <code>name</code>, <code>ag</code> и <code>network</code> запрещены к изменению после создания.</>,
  ],

  tbl_service_binding: [
    <>Уникальность пары <code>(ag, service)</code>.</>,
    <>Уникальность пары <code>(name, ns)</code>.</>,
    <>Поля <code>uid</code>, <code>name</code>, <code>ag</code> и <code>service</code> запрещены к изменению после создания.</>,
    <><code>trg_service_binding_transport_overlap</code> запрещает bind, если transport-настройки сервиса пересекутся с уже привязанными к той же <code>AddressGroup</code> сервисами.</>,
  ],
}
