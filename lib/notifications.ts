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
    // 실제 서비스에서는 이메일 서비스 API (예: SendGrid, Nodemailer 등) 사용
    // 여기서는 데모용 로직
    
    const emailContent = `
    안녕하세요 ${reservationData.customerName}님,
    
    예약이 성공적으로 완료되었습니다.
    
    📋 예약 상세 정보
    ━━━━━━━━━━━━━━━━━━━━━━
    🍽️ 매장: ${reservationData.restaurantName || '맛집 예약 포털'}
    👤 예약자: ${reservationData.customerName}
    📅 날짜: ${reservationData.date}
    🕐 시간: ${reservationData.time}
    👥 인원: ${reservationData.partySize}명
    
    📞 문의사항이 있으시면 언제든지 연락 주세요.
    
    감사합니다.
    맛집 예약 포털 팀 드림
    `

    console.log('📧 이메일 발송 (데모):', {
      to: reservationData.customerEmail,
      subject: '[맛집예약] 예약 확정 안내',
      content: emailContent
    })

    // 실제 이메일 발송을 시뮬레이션하는 지연
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  } catch (error) {
    console.error('이메일 발송 실패:', error)
    return false
  }
}

export const sendSMSNotification = async (reservationData: ReservationData): Promise<boolean> => {
  try {
    // 실제 서비스에서는 SMS 서비스 API (예: Twilio, 네이버 클라우드 등) 사용
    // 여기서는 데모용 로직
    
    const smsContent = `[맛집예약] ${reservationData.customerName}님, 예약이 완료되었습니다.
📅 ${reservationData.date} ${reservationData.time}
👥 ${reservationData.partySize}명
문의: 1588-0000`

    console.log('📱 SMS 발송 (데모):', {
      to: reservationData.customerPhone,
      content: smsContent
    })

    // 실제 SMS 발송을 시뮬레이션하는 지연
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return true
  } catch (error) {
    console.error('SMS 발송 실패:', error)
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