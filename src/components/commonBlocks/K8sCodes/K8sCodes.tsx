import React, { FC } from 'react'
import { K8S_RESPOND_CODES } from '@site/src/constants/k8sErrorCodes'

type Props = {
  codes: (keyof typeof K8S_RESPOND_CODES)[]
}

export const K8sCodes: FC<Props> = ({ codes }) => {
  return (
    <div className="error-codes-block">
      <div className="error-codes-block__header">Коды ошибок</div>
      <table>
        <thead>
          <tr>
            <th>HTTP</th>
            <th>reason</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((key) => {
            const item = K8S_RESPOND_CODES[key]
            if (!item) return null
            return (
              <tr key={key}>
                <td>{item.httpCode}</td>
                <td><code>{item.reason}</code></td>
                <td>{item.description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
