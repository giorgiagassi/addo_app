export type TProduct = {
  length: number,
  height: number,
  weight: number,
  width: number
}

export type TDelivery = {
  product: TProduct,
  subcontainer: string,
  num_order: string | null,
  start_date: string | null,
  end_date: string | null,
  recipient_email: string | null,
  recipient_first_name: string | null,
  recipient_last_name: string | null,
  recipient_phone_prefix: string | null,
  recipient_phone: string | null
}

export type TSubContainer = {
  uuid: string,
  height: number,
  machine_id: string,
  daily_rate: number,
  length: number,
  width: number,
  status: number,
}

export type TDeliveryResult = {
  created_at: string,
  end_date: string,
  num_order: number,
  product: TProduct,
  qr_delivery: string
  qr_withdraw: string,
  recipient_email: string,
  recipient_first_name: string
  recipient_last_name: string
  recipient_phone: number
  recipient_phone_prefix: string
  start_date: string
  state: string
  subcontainer: string
  uuid: string
}

export type TStorico = {
 count: number | null | undefined,
 next: string | null | undefined,
 previous: string | null | undefined,
  results: TDeliveryResult[]
}
