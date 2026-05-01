import React, { FC } from 'react'
import { K8S_VALIDATIONS, type K8sOperation } from '@site/src/constants/k8sValidations'
import type { TRestrictionItems } from '@site/src/customTypes/restrictions'

type ServerItem = { label: string; rules: TRestrictionItems }

type Props = {
  op: K8sOperation
  serverItems?: ServerItem[]
}

export const K8sValidation: FC<Props> = ({ op, serverItems = [] }) => {
  const k8sGroups = K8S_VALIDATIONS[op]
  if (!k8sGroups) return null
  return (
    <div className="validation-block">
      <div className="validation-block__header">Валидация</div>
      <div className="validation-block__body">
        {k8sGroups.map(({ label, rules }, i) => (
          <details key={`k-${i}`} open={i === 0}>
            <summary><code>{label}</code></summary>
            <ul>
              {rules.map((rule, j) => (
                <li key={j}>{rule}</li>
              ))}
            </ul>
          </details>
        ))}
        {serverItems.map(({ label, rules }, i) => (
          <details key={`s-${i}`}>
            <summary><span className="validation-block__source">sg-server</span> <code>{label}</code></summary>
            <ul>
              {rules.map((rule, j) => (
                <li key={j}>{rule}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  )
}
