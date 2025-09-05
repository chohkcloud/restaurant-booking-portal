import { supabase } from './supabase'
import { format, toZonedTime } from 'date-fns-tz'

export interface ReservationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  restaurantName?: string
}

export interface Reservation {
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
}

// 예약 생성
export const createReservation = async (
  userId: string, 
  reservationData: ReservationData,
  restaurantId?: string
): Promise<{
  success: boolean
  message: string
  reservation?: Reservation
}> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: userId,
          restaurant_name: reservationData.restaurantName || '맛집 예약 포털',
          restaurant_id: restaurantId || null,
          reservation_date: reservationData.date,
          reservation_time: reservationData.time,
          party_size: reservationData.partySize,
          status: 'confirmed',
          email_sent: false,
          sms_sent: false
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('예약 생성 DB 오류:', error)
      return {
        success: false,
        message: '예약 생성 중 오류가 발생했습니다.'
      }
    }

    return {
      success: true,
      message: '예약이 생성되었습니다.',
      reservation: data
    }
  } catch (error) {
    console.error('예약 생성 오류:', error)
    return {
      success: false,
      message: '예약 생성 중 오류가 발생했습니다.'
    }
  }
}

// 예약 알림 상태 업데이트
export const updateReservationNotificationStatus = async (
  reservationId: string,
  emailSent: boolean,
  smsSent: boolean
): Promise<{
  success: boolean
  message: string
}> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({
        email_sent: emailSent,
        sms_sent: smsSent,
        updated_at: format(toZonedTime(new Date(), 'Asia/Seoul'), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'Asia/Seoul' })
      })
      .eq('id', reservationId)

    if (error) {
      console.error('예약 알림 상태 업데이트 오류:', error)
      return {
        success: false,
        message: '알림 상태 업데이트 실패'
      }
    }

    return {
      success: true,
      message: '알림 상태가 업데이트되었습니다.'
    }
  } catch (error) {
    console.error('예약 알림 상태 업데이트 오류:', error)
    return {
      success: false,
      message: '알림 상태 업데이트 실패'
    }
  }
}

// 사용자의 예약 목록 조회
export const getUserReservations = async (userId: string): Promise<{
  success: boolean
  message: string
  reservations?: Reservation[]
}> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('예약 목록 조회 오류:', error)
      return {
        success: false,
        message: '예약 목록을 가져오는 중 오류가 발생했습니다.'
      }
    }

    return {
      success: true,
      message: '예약 목록을 가져왔습니다.',
      reservations: data || []
    }
  } catch (error) {
    console.error('예약 목록 조회 오류:', error)
    return {
      success: false,
      message: '예약 목록을 가져오는 중 오류가 발생했습니다.'
    }
  }
}

// 예약 상세 정보 조회
export const getReservationById = async (reservationId: string): Promise<{
  success: boolean
  message: string
  reservation?: Reservation
}> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (error || !data) {
      return {
        success: false,
        message: '예약을 찾을 수 없습니다.'
      }
    }

    return {
      success: true,
      message: '예약 정보를 가져왔습니다.',
      reservation: data
    }
  } catch (error) {
    console.error('예약 조회 오류:', error)
    return {
      success: false,
      message: '예약 조회 중 오류가 발생했습니다.'
    }
  }
}

// 예약 취소
export const cancelReservation = async (reservationId: string): Promise<{
  success: boolean
  message: string
}> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({
        status: 'cancelled',
        updated_at: format(toZonedTime(new Date(), 'Asia/Seoul'), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'Asia/Seoul' })
      })
      .eq('id', reservationId)

    if (error) {
      console.error('예약 취소 오류:', error)
      return {
        success: false,
        message: '예약 취소 중 오류가 발생했습니다.'
      }
    }

    return {
      success: true,
      message: '예약이 취소되었습니다.'
    }
  } catch (error) {
    console.error('예약 취소 오류:', error)
    return {
      success: false,
      message: '예약 취소 중 오류가 발생했습니다.'
    }
  }
}