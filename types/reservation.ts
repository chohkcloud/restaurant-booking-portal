export interface ReservationInfo {
  id?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  restaurantName?: string
}

export interface ReservationRecord {
  id: string
  user_id: string
  restaurant_name: string
  reservation_date: string
  reservation_time: string
  party_size: number
  status: string
  email_sent: boolean
  sms_sent: boolean
  created_at: string
  updated_at: string
  reservationDateTime?: Date
}