import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customerName, 
      customerPhone, 
      date, 
      time, 
      partySize, 
      restaurantName 
    } = body

    // SMS 메시지 내용
    const smsContent = `[${restaurantName}] ${customerName}님, 예약이 완료되었습니다.

📅 ${date} ${time}
👥 ${partySize}명

⚠️ 예약시간 15분 전 도착
📞 문의: 1588-0000

감사합니다.`

    // 네이버 클라우드 플랫폼 SENS SMS API 호출
    // 실제 서비스에서는 환경변수로 설정
    const serviceId = process.env.NAVER_SMS_SERVICE_ID
    const accessKey = process.env.NAVER_ACCESS_KEY
    const secretKey = process.env.NAVER_SECRET_KEY
    const fromNumber = process.env.SMS_FROM_NUMBER || '1588-0000'

    if (!serviceId || !accessKey || !secretKey) {
      console.log('SMS 설정 정보가 없어 데모 모드로 실행합니다.')
      console.log('📱 SMS 발송 (데모):', {
        to: customerPhone,
        content: smsContent
      })
      
      // 데모용 지연
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({ 
        success: true, 
        message: 'SMS 발송 완료 (데모 모드)',
        demo: true 
      })
    }

    // 실제 SMS 발송 로직 (네이버 클라우드 플랫폼 SENS)
    const timestamp = Date.now().toString()
    const method = 'POST'
    const space = ' '
    const newLine = '\n'
    const url = `/sms/v2/services/${serviceId}/messages`
    const url2 = `https://sens.apigw.ntruss.com${url}`
    
    // 시그니처 생성
    const hmac = crypto.createHmac('sha256', secretKey)
    hmac.update(method)
    hmac.update(space)
    hmac.update(url)
    hmac.update(newLine)
    hmac.update(timestamp)
    hmac.update(newLine)
    hmac.update(accessKey)
    const hash = hmac.digest('base64')

    const smsData = {
      type: 'LMS', // 장문 SMS (90바이트 초과)
      from: fromNumber,
      content: smsContent,
      messages: [
        {
          to: customerPhone.replace(/-/g, ''), // 하이픈 제거
          content: smsContent
        }
      ]
    }

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': accessKey,
      'x-ncp-apigw-signature-v2': hash,
    }

    const response = await fetch(url2, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(smsData),
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('SMS 발송 성공:', result)
      return NextResponse.json({ success: true, data: result })
    } else {
      console.error('SMS 발송 실패:', result)
      return NextResponse.json({ 
        success: false, 
        error: result.errorMessage || 'SMS 발송 실패' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('SMS API 오류:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'SMS 발송 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}