import { defineDbSchemaDiagramFromDbml } from '@site/src/utils/dbmlToDiagram'

const DATABASE_SCHEMA_DBML = `
Enum "sgroups"."ip_family" {
  "IPv4"
  "IPv6"
}

Enum "sgroups"."policy_action" {
  "DENY"
  "ALLOW"
}

Enum "sgroups"."proto" {
  "tcp"
  "udp"
  "icmp"
}

Enum "sgroups"."resource_type" {
  "Namespace"
  "AddressGroup"
  "Host"
  "HostBinding"
  "Service"
  "ServiceBinding"
  "Network"
  "NetworkBinding"
  "Ag2AgRule"
  "Ag2AgIcmpRule"
  "Ag2IcmpRule"
  "Ag2CidrRule"
  "Ag2CidrIcmpRule"
  "Ag2FqdnRule"
  "Svc2SvcRule"
  "Svc2FqdnRule"
  "Svc2CidrRule"
  "Svc2CidrIcmpRule"
}

Enum "sgroups"."traffic" {
  "both"
  "ingress"
  "egress"
}

Table "sgroups"."tbl_global_resource_version" {
  "id" int2 [pk, not null]
  "v" int8 [not null, check: \`v >= 0\`]
  Note: 'Singleton table for global resourceVersion counter (id=1)'
}

Table "sgroups"."tbl_outbox_resource_events" {
  "event_id" int8 [pk, not null, increment]
  "ts" timestamptz [not null, default: \`clock_timestamp()\`]
  "resource_version" int8 [not null]
  "resource_type" sgroups.resource_type [not null]
  "event_type" text
  "object" jsonb [not null]

  Indexes {
    ts [type: btree, name: "outbox_resource_events_ts_idx"]
    (resource_type, resource_version, event_id) [type: btree, name: "outbox_resource_events_type_rv_event_id_idx"]
  }
  Note: 'Outbox table for resource events stream'
}

Table "sgroups"."tbl_namespace" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [unique, not null]
  "display_name" text [default: \`NULL::text\`]
  "comment" text
  "description" text
  "labels" public.hstore
  "annotations" public.hstore
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    annotations [type: gin, name: "ns_annotations_gin_idx"]
    labels [type: gin, name: "ns_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_ag" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "default_action" sgroups.policy_action [not null, default: 'DENY']
  "logs" bool [not null, default: false]
  "trace" bool [not null, default: false]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]
  "binding_rev" int8 [not null, default: 0]
  "rule_rev" int8 [not null, default: 0]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag_name_uq"]
    annotations [type: gin, name: "ag_annotations_gin_idx"]
    labels [type: gin, name: "ag_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_network" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "display_name" text [default: \`NULL::text\`]
  "network" cidr [not null]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]
  "binding_rev" int8 [not null, default: 0]

  Indexes {
    (name, ns) [type: btree, unique, name: "network_name_uniqueness"]
    annotations [type: gin, name: "nw_annotations_gin_idx"]
    labels [type: gin, name: "nw_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_host" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "display_name" text [default: \`NULL::text\`]
  "ips" "inet[]" [not null, default: 'ARRAY[inet[]']
  "meta_info" jsonb
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]
  "binding_rev" int8 [not null, default: 0]

  Indexes {
    (name, ns) [type: btree, unique, name: "host_name_uq"]
    annotations [type: gin, name: "host_annotations_gin_idx"]
    labels [type: gin, name: "host_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_host_binding" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "ag" int8
  "host" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (ag, host) [type: btree, unique, name: "host_binding_ag_host_uq"]
    (name, ns) [type: btree, unique, name: "host_binding_name_uq"]
    annotations [type: gin, name: "host_binding_annotations_gin_idx"]
    labels [type: gin, name: "host_binding_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_network_binding" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "ag" int8
  "network" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (ag, network) [type: btree, unique, name: "network_binding_ag_network_uq"]
    (name, ns) [type: btree, unique, name: "network_binding_name_uq"]
    annotations [type: gin, name: "network_binding_annotations_gin_idx"]
    labels [type: gin, name: "network_binding_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_service" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "display_name" text [default: \`NULL::text\`]
  "transports" "transport[]"
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]
  "binding_rev" int8 [not null, default: 0]
  "rule_rev" int8 [not null, default: 0]

  Indexes {
    (name, ns) [type: btree, unique, name: "service_name_uq"]
    annotations [type: gin, name: "service_annotations_gin_idx"]
    labels [type: gin, name: "service_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_service_binding" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "ag" int8
  "service" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (ag, service) [type: btree, unique, name: "service_binding_ag_service_uq"]
    (name, ns) [type: btree, unique, name: "service_binding_name_uq"]
    annotations [type: gin, name: "service_binding_annotations_gin_idx"]
    labels [type: gin, name: "service_binding_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_rule_registry" {
  "uid" uuid [pk, not null]
  "name" text [not null]
  "ns" int8

  Indexes {
    (name, ns) [type: btree, unique, name: "rule_registry_name_ns_uq"]
  }
  Note: 'registry for lookup rules of all kinds by primary keys'
}

Table "sgroups"."tbl_ag2ag_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "aglocal" int8
  "agremote" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "proto" sgroups.proto [not null]
  "ip_v" sgroups.ip_family [not null]
  "entries" "port_entries[]"
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag2ag_rule_name_uq"]
    aglocal [type: btree, name: "ag2ag_rule_ag_local_idx"]
    agremote [type: btree, name: "ag2ag_rule_ag_remote_idx"]
    annotations [type: gin, name: "ag2ag_rule_annotations_gin_idx"]
    labels [type: gin, name: "ag2ag_rule_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_ag2ag_icmp_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "aglocal" int8
  "agremote" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "ip_v" sgroups.ip_family [not null]
  "entries" "icmp_entries[]"
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag2ag_icmp_rule_name_uq"]
    aglocal [type: btree, name: "ag2ag_icmp_rule_ag_local_idx"]
    agremote [type: btree, name: "ag2ag_icmp_rule_ag_remote_idx"]
    annotations [type: gin, name: "ag2ag_icmp_rule_annotations_gin_idx"]
    labels [type: gin, name: "ag2ag_icmp_rule_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_ag2icmp_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "aglocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "ip_v" sgroups.ip_family [not null]
  "entries" "icmp_entries[]"
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag2icmp_rule_name_uq"]
    aglocal [type: btree, name: "ag2icmp_rule_ag_local_idx"]
    annotations [type: gin, name: "ag2icmp_rule_annotations_gin_idx"]
    labels [type: gin, name: "ag2icmp_rule_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_ag2cidr_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "aglocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "proto" sgroups.proto
  "ip_v" sgroups.ip_family [not null]
  "entries" "port_entries[]"
  "cidr" cidr [not null]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag2cidr_rule_name_uq"]
    aglocal [type: btree, name: "ag2cidr_rule_ag_local_idx"]
    annotations [type: gin, name: "ag2cidr_rule_annotations_gin_idx"]
    labels [type: gin, name: "ag2cidr_rule_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_ag2cidr_icmp_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "aglocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "ip_v" sgroups.ip_family [not null]
  "entries" "icmp_entries[]"
  "cidr" cidr [not null]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag2cidr_icmp_rule_name_uq"]
    aglocal [type: btree, name: "ag2cidr_icmp_rule_ag_local_idx"]
    annotations [type: gin, name: "ag2cidr_icmp_rule_annotations_gin_idx"]
    labels [type: gin, name: "ag2cidr_icmp_rule_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_ag2fqdn_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "aglocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "proto" sgroups.proto
  "ip_v" sgroups.ip_family [not null]
  "entries" "port_entries[]"
  "fqdn" public.citext [not null]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "ag2fqdn_rule_name_uq"]
    aglocal [type: btree, name: "ag2fqdn_rule_ag_local_idx"]
    annotations [type: gin, name: "ag2fqdn_rule_annotations_gin_idx"]
    labels [type: gin, name: "ag2fqdn_rule_labels_gin_idx"]
  }
}

Table "sgroups"."tbl_svc2svc_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "svclocal" int8
  "svcremote" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "proto" sgroups.proto [not null]
  "ip_v" sgroups.ip_family [not null]
  "entries" "port_entries[]"
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "svc2svc_rule_name_uq"]
    annotations [type: gin, name: "svc2svc_rule_annotations_gin_idx"]
    labels [type: gin, name: "svc2svc_rule_labels_gin_idx"]
    svclocal [type: btree, name: "svc2svc_rule_svc_local_idx"]
    svcremote [type: btree, name: "svc2svc_rule_svc_remote_idx"]
  }
}

Table "sgroups"."tbl_svc2fqdn_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "svclocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "proto" sgroups.proto
  "ip_v" sgroups.ip_family [not null]
  "entries" "port_entries[]"
  "fqdn" public.citext [not null]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "svc2fqdn_rule_name_uq"]
    annotations [type: gin, name: "svc2fqdn_rule_annotations_gin_idx"]
    labels [type: gin, name: "svc2fqdn_rule_labels_gin_idx"]
    svclocal [type: btree, name: "svc2fqdn_rule_svc_local_idx"]
  }
}

Table "sgroups"."tbl_svc2cidr_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "svclocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "proto" sgroups.proto
  "ip_v" sgroups.ip_family [not null]
  "entries" "port_entries[]"
  "cidr" cidr [not null]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "svc2cidr_rule_name_uq"]
    annotations [type: gin, name: "svc2cidr_rule_annotations_gin_idx"]
    labels [type: gin, name: "svc2cidr_rule_labels_gin_idx"]
    svclocal [type: btree, name: "svc2cidr_rule_svc_local_idx"]
  }
}

Table "sgroups"."tbl_svc2cidr_icmp_rule" {
  "id" int8 [pk, not null, increment]
  "uid" uuid [unique, not null, default: \`gen_random_uuid()\`]
  "name" text [not null]
  "ns" int8
  "svclocal" int8
  "display_name" text [default: \`NULL::text\`]
  "labels" public.hstore
  "annotations" public.hstore
  "comment" text
  "description" text
  "action" sgroups.policy_action [not null, default: 'DENY']
  "traffic" sgroups.traffic [not null]
  "ip_v" sgroups.ip_family [not null]
  "entries" "icmp_entries[]"
  "cidr" cidr [not null]
  "creation_timestamp" timestamptz [not null, default: \`now()\`]
  "resource_version" text [not null]

  Indexes {
    (name, ns) [type: btree, unique, name: "svc2cidr_icmp_rule_name_uq"]
    annotations [type: gin, name: "svc2cidr_icmp_rule_annotations_gin_idx"]
    labels [type: gin, name: "svc2cidr_icmp_rule_labels_gin_idx"]
    svclocal [type: btree, name: "svc2cidr_icmp_rule_svc_local_idx"]
  }
}

Table "sg_db_ver" {
  "id" int4 [pk, not null, increment]
  "version_id" int8 [not null]
  "is_applied" bool [not null]
  "tstamp" timestamp [not null, default: \`now()\`]
}

Ref "fk_ag___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2ag_icmp_rule___ag_local":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2ag_icmp_rule"."aglocal" [update: restrict, delete: cascade]

Ref "fk_ag2ag_icmp_rule___ag_remote":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2ag_icmp_rule"."agremote" [update: restrict, delete: cascade]

Ref "fk_ag2ag_icmp_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag2ag_icmp_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2ag_icmp_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_ag2ag_icmp_rule"."uid" [delete: cascade]

Ref "fk_ag2ag_rule___ag_local":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2ag_rule"."aglocal" [update: restrict, delete: cascade]

Ref "fk_ag2ag_rule___ag_remote":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2ag_rule"."agremote" [update: restrict, delete: cascade]

Ref "fk_ag2ag_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag2ag_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2ag_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_ag2ag_rule"."uid" [delete: cascade]

Ref "fk_ag2cidr_icmp_rule___ag_local":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2cidr_icmp_rule"."aglocal" [update: restrict, delete: cascade]

Ref "fk_ag2cidr_icmp_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag2cidr_icmp_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2cidr_icmp_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_ag2cidr_icmp_rule"."uid" [delete: cascade]

Ref "fk_ag2cidr_rule___ag_local":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2cidr_rule"."aglocal" [update: restrict, delete: cascade]

Ref "fk_ag2cidr_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag2cidr_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2cidr_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_ag2cidr_rule"."uid" [delete: cascade]

Ref "fk_ag2fqdn_rule___ag_local":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2fqdn_rule"."aglocal" [update: restrict, delete: cascade]

Ref "fk_ag2fqdn_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag2fqdn_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2fqdn_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_ag2fqdn_rule"."uid" [delete: cascade]

Ref "fk_ag2icmp_rule___ag_local":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_ag2icmp_rule"."aglocal" [update: restrict, delete: cascade]

Ref "fk_ag2icmp_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_ag2icmp_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_ag2icmp_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_ag2icmp_rule"."uid" [delete: cascade]

Ref "fk_host___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_host"."ns" [update: restrict, delete: cascade]

Ref "fk_host_binding___ag":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_host_binding"."ag" [update: restrict, delete: cascade]

Ref "fk_host_binding___host":"sgroups"."tbl_host"."id" < "sgroups"."tbl_host_binding"."host" [update: restrict, delete: cascade]

Ref "fk_host_binding___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_host_binding"."ns" [update: restrict, delete: cascade]

Ref "fk_network___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_network"."ns" [update: restrict, delete: cascade]

Ref "fk_network_binding___ag":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_network_binding"."ag" [update: restrict, delete: cascade]

Ref "fk_network_binding___network":"sgroups"."tbl_network"."id" < "sgroups"."tbl_network_binding"."network" [update: restrict, delete: cascade]

Ref "fk_network_binding___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_network_binding"."ns" [update: restrict, delete: cascade]

Ref "fk_rule_registry___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_rule_registry"."ns" [update: restrict, delete: cascade]

Ref "fk_service___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_service"."ns" [update: restrict, delete: cascade]

Ref "fk_service_binding___ag":"sgroups"."tbl_ag"."id" < "sgroups"."tbl_service_binding"."ag" [update: restrict, delete: cascade]

Ref "fk_service_binding___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_service_binding"."ns" [update: restrict, delete: cascade]

Ref "fk_service_binding___service":"sgroups"."tbl_service"."id" < "sgroups"."tbl_service_binding"."service" [update: restrict, delete: cascade]

Ref "fk_svc2cidr_icmp_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_svc2cidr_icmp_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_svc2cidr_icmp_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_svc2cidr_icmp_rule"."uid" [delete: cascade]

Ref "fk_svc2cidr_icmp_rule___svc_local":"sgroups"."tbl_service"."id" < "sgroups"."tbl_svc2cidr_icmp_rule"."svclocal" [update: restrict, delete: cascade]

Ref "fk_svc2cidr_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_svc2cidr_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_svc2cidr_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_svc2cidr_rule"."uid" [delete: cascade]

Ref "fk_svc2cidr_rule___svc_local":"sgroups"."tbl_service"."id" < "sgroups"."tbl_svc2cidr_rule"."svclocal" [update: restrict, delete: cascade]

Ref "fk_svc2fqdn_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_svc2fqdn_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_svc2fqdn_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_svc2fqdn_rule"."uid" [delete: cascade]

Ref "fk_svc2fqdn_rule___svc_local":"sgroups"."tbl_service"."id" < "sgroups"."tbl_svc2fqdn_rule"."svclocal" [update: restrict, delete: cascade]

Ref "fk_svc2svc_rule___ns":"sgroups"."tbl_namespace"."id" < "sgroups"."tbl_svc2svc_rule"."ns" [update: restrict, delete: cascade]

Ref "fk_svc2svc_rule___registry":"sgroups"."tbl_rule_registry"."uid" < "sgroups"."tbl_svc2svc_rule"."uid" [delete: cascade]

Ref "fk_svc2svc_rule___svc_local":"sgroups"."tbl_service"."id" < "sgroups"."tbl_svc2svc_rule"."svclocal" [update: restrict, delete: cascade]

Ref "fk_svc2svc_rule___svc_remote":"sgroups"."tbl_service"."id" < "sgroups"."tbl_svc2svc_rule"."svcremote" [update: restrict, delete: cascade]


`

const DATABASE_SCHEMA_TABLE_META = {
  tbl_namespace: { tone: 'resource', position: { column: 0, row: 1 } },
  tbl_ag: { tone: 'resource', position: { column: 1, row: 0 } },
  tbl_network: { tone: 'resource', position: { column: 1, row: 2 } },
  tbl_host: { tone: 'resource', position: { column: 1, row: 3 } },
  tbl_service: { tone: 'resource', position: { column: 1, row: 4 } },
  tbl_host_binding: { tone: 'binding', position: { column: 2, row: 3 } },
  tbl_network_binding: { tone: 'binding', position: { column: 2, row: 4 } },
  tbl_service_binding: { tone: 'binding', position: { column: 2, row: 5 } },
  tbl_rule_registry: { tone: 'rule', position: { column: 2, row: 1 } },
  tbl_ag2ag_rule: { tone: 'rule', position: { column: 3, row: 0 } },
  tbl_ag2ag_icmp_rule: { tone: 'rule', position: { column: 3, row: 1 } },
  tbl_ag2icmp_rule: { tone: 'rule', position: { column: 3, row: 2 } },
  tbl_ag2cidr_rule: { tone: 'rule', position: { column: 3, row: 3 } },
  tbl_ag2cidr_icmp_rule: { tone: 'rule', position: { column: 3, row: 4 } },
  tbl_ag2fqdn_rule: { tone: 'rule', position: { column: 3, row: 5 } },
  tbl_svc2svc_rule: { tone: 'rule', position: { column: 4, row: 1 } },
  tbl_svc2fqdn_rule: { tone: 'rule', position: { column: 4, row: 2 } },
  tbl_svc2cidr_rule: { tone: 'rule', position: { column: 4, row: 3 } },
  tbl_svc2cidr_icmp_rule: { tone: 'rule', position: { column: 4, row: 4 } },
  tbl_global_resource_version: { tone: 'system', position: { column: 0, row: 6 } },
  tbl_outbox_resource_events: { tone: 'system', position: { column: 2, row: 7 } },
} as const

export const DATABASE_SCHEMA_DIAGRAM = defineDbSchemaDiagramFromDbml({
  title: 'ER-диаграмма схемы `sgroups`',
  description: 'Диаграмма построена из DBML-подобного описания таблиц и связей и показывает ключевые поля, как в dbdiagram-подобных ER-схемах.',
  columns: 5,
  legend: [
    { label: 'Ресурсы', tone: 'resource' },
    { label: 'Bindings', tone: 'binding' },
    { label: 'Rule-таблицы', tone: 'rule' },
    { label: 'Служебные таблицы', tone: 'system' },
  ],
  dbml: DATABASE_SCHEMA_DBML,
  tableMeta: DATABASE_SCHEMA_TABLE_META,
})
