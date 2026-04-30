import React, { FC } from 'react'
import type { TRestrictionItems } from '@site/src/customTypes/restrictions'

type Props = {
  items: { label: string; rules: TRestrictionItems }[]
}

export const Restrictions: FC<Props> = ({ items }) => {
  return (
    <div className="validation-block">
      <div className="validation-block__header">Валидация</div>
      <div className="validation-block__body">
        {items.map(({ label, rules }, i) => (
          <details key={i} open={i === 0}>
            <summary><code>{label}</code></summary>
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
