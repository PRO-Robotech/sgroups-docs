import React, { FC } from 'react'
import { RESPOND_CODES } from '@site/src/constants/errorCodes'

type Props = {
  codes: (keyof typeof RESPOND_CODES)[]
}

export const Codes: FC<Props> = ({ codes }) => {
  return (
    <div className="error-codes-block">
      <div className="error-codes-block__header">Коды ошибок</div>
      <table>
        <thead>
          <tr>
            <th>gRPC</th>
            <th>HTTP</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((key) => {
            const item = RESPOND_CODES[key]
            if (!item) return null
            return (
              <tr key={key}>
                <td><code>{item.grpcCode}</code></td>
                <td>{item.httpCode}</td>
                <td>{item.description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
