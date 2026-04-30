import React, { FC, PropsWithChildren } from 'react'

type Props = {
  method: 'POST' | 'GET' | 'DELETE'
  endpoint: string
}

export const ApiOperation: FC<PropsWithChildren<Props>> = ({ method, endpoint, children }) => (
  <div className="api-operation">
    <div className="api-operation__header">
      <span className={`api-method api-method--${method.toLowerCase()}`}>{method}</span>
      <code className="api-endpoint">{endpoint}</code>
    </div>
    <div className="api-operation__body">
      {children}
    </div>
  </div>
)
