export type TRespondCodesItem = {
  grpcCode: string
  grpcNumber: string
  httpCode: string
  description: string
}

export type TRespondsCodes = Record<string, TRespondCodesItem>
