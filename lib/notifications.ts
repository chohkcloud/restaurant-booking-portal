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

export const sendReservationNotifications = async (reservationData: ReservationData): Promise<{
  emailSent: boolean
  smsSent: boolean
}> => {
  const [emailResult, smsResult] = await Promise.allSettled([
    sendEmailNotification(reservationData),
    sendSMSNotification(reservationData)
  ])

  return {
    emailSent: emailResult.status === 'fulfilled' ? emailResult.value : false,
    smsSent: smsResult.status === 'fulfilled' ? smsResult.value : false
  }
}