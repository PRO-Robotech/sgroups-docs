export const RES_TYPES = ['AddressGroup', 'Host', 'Network', 'Service', 'Rule'] as const
export type TResType = (typeof RES_TYPES)[number]

const toEnum = (values: readonly string[]): string => `Enum(${values.map(v => `"${v}"`).join(', ')})`

export const TYPES = {
  string: 'string',
  bool: 'bool',
  int64: 'int64',
  uint32: 'uint32[]',
  timestamp: 'Timestamp',
  mapStringString: 'map<string, string>',
  resourceRef: 'ResourceRef[]',
  resourceIdentifier: 'ResourceIdentifier',
  entry: 'Entry[]',
  transport: 'Transport[]',
  transportSingle: 'Transport',
  endpoints: 'Endpoints',
  endpoint: 'Endpoint',
  session: 'Session',
  enumAction: 'Enum("ALLOW", "DENY")',
  enumTraffic: 'Enum("BOTH", "INGRESS", "EGRESS")',
  enumTrafficEgressBoth: 'Enum("EGRESS", "BOTH")',
  enumTrafficIngress: 'Enum("INGRESS")',
  enumTrafficEgress: 'Enum("EGRESS")',
  enumTrafficIngressEgress: 'Enum("INGRESS", "EGRESS")',
  enumProtocol: 'Enum("TCP", "UDP", "ICMP")',
  enumIpv: 'Enum("IPv4", "IPv6")',
  enumEndpointLocal: 'Enum("ADDRESS_GROUP", "SERVICE")',
  enumEndpointRemote: 'Enum("ADDRESS_GROUP", "SERVICE", "FQDN", "CIDR")',
  enumEndpointAG: 'Enum("ADDRESS_GROUP")',
  enumEndpointSVC: 'Enum("SERVICE")',
  enumEndpointFQDN: 'Enum("FQDN")',
  enumEndpointCIDR: 'Enum("CIDR")',
  enumResType: toEnum(RES_TYPES),
} as const
