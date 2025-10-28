/**
 * Type definitions for PayGate Prime
 */

export interface ChannelRegistrationData {
  open_channel_id: string
  open_channel_title: string
  open_channel_description: string
  closed_channel_id: string
  closed_channel_title: string
  closed_channel_description: string
  sub_1_price?: number
  sub_1_time?: number
  sub_2_price?: number
  sub_2_time?: number
  sub_3_price?: number
  sub_3_time?: number
  client_wallet_address: string
  client_payout_currency: string
  client_payout_network: string
  captcha_token: string
}

export interface NetworkCurrencyMapping {
  network_code: string
  network_name: string
  currency_code: string
  currency_name: string
}

export interface Network {
  code: string
  name: string
}

export interface Currency {
  code: string
  name: string
}

export interface RegistrationResponse {
  id: number
  open_channel_id: string
  open_channel_title: string
  closed_channel_id: string
  closed_channel_title: string
  created_at: string
  is_active: boolean
  verified: boolean
}

export interface ApiError {
  detail: string | { msg: string; type: string }[]
}
