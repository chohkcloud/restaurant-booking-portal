export interface ReservationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  restaurantName?: string
}

export const sendEmailNotification = async (reservationData: ReservationData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: reservationData.customerName,
        customerEmail: reservationData.customerEmail,
        date: reservationData.date,
        time: reservationData.time,
        partySize: reservationData.partySize,
        restaurantName: reservationData.restaurantName || '맛집 예약 포털'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ 이메일 발송 성공')
      return true
    } else {
      console.error('❌ 이메일 발송 실패:', result.error)
      return false
    }
  } catch (error) {
    console.error('이메일 발송 API 호출 실패:', error)
    return false
  }
}

export const sendSMSNotification = async (reservationData: ReservationData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: reservationData.customerName,
        customerPhone: reservationData.customerPhone,
        date: reservationData.date,
        time: reservationData.time,
        partySize: reservationData.partySize,
        restaurantName: reservationData.restaurantName || '맛집 예약 포털'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ SMS 발송 성공', result.demo ? '(데모 모드)' : '')
      return true
    } else {
      console.error('❌ SMS 발송 실패:', result.error)
      return false
    }
  } catch (error) {
    console.error('SMS 발송 API 호출 실패:', error)
    return false
  }
}

// 취소 메일 발솨 기능
export const sendCancellationEmailNotification = async (reservationData: ReservationData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: reservationData.customerName,
        customerEmail: reservationData.customerEmail,
        date: reservationData.date,
        time: reservationData.time,
        partySize: reservationData.partySize,
        restaurantName: reservationData.restaurantName || '맛집 예약 포털',
        type: 'cancellation' // 취소 메일 타입
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ 취소 메일 발송 성공')
      return true
    } else {
      console.error('❌ 취소 메일 발송 실패:', result.error)
      return false
    }
  } catch (error) {
    console.error('취소 메일 발송 API 호출 실패:', error)
    return false
  }
}

export const sendReservationNotifications = async (
  reservationData: ReservationData,
  reservationId?: string
): Promise<{
  emailSent: boolean
  smsSent: boolean
}> => {
  const [emailResult, smsResult] = await Promise.allSettled([
    sendEmailNotification(reservationData),
    sendSMSNotification(reservationData)
  ])

  const emailSent = emailResult.status === 'fulfilled' ? emailResult.value : false
  const smsSent = smsResult.status === 'fulfilled' ? smsResult.value : false

  // 예약 ID가 있으면 알림 상태를 DB에 업데이트
  if (reservationId) {
    try {
      const { updateReservationNotificationStatus } = await import('./reservations')
      await updateReservationNotificationStatus(reservationId, emailSent, smsSent)
    } catch (error) {
      console.error('알림 상태 업데이트 실패:', error)
    }
  }

  return {
    emailSent,
    smsSent
  }
}

// 취소 알림 발송
export const sendCancellationNotifications = async (
  reservationData: ReservationData
): Promise<{
  emailSent: boolean
}> => {
  const emailSent = await sendCancellationEmailNotification(reservationData)
  
  return {
    emailSent
  }
}