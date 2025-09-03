import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customerName, 
      customerEmail, 
      date, 
      time, 
      partySize, 
      restaurantName 
    } = body

    // 이메일 HTML 템플릿
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>예약 확정 안내</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #ff6b35 0%, #f55336 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border: 1px solid #dee2e6;
        }
        .reservation-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ff6b35;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          font-weight: 600;
          color: #555;
        }
        .detail-value {
          font-weight: 500;
          color: #333;
        }
        .footer {
          background: #343a40;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          font-size: 14px;
        }
        .icon {
          font-size: 20px;
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🍽️ 예약 확정 안내</h1>
        <p>안녕하세요 ${customerName}님, 예약이 성공적으로 완료되었습니다!</p>
      </div>
      
      <div class="content">
        <div class="reservation-details">
          <h3 style="color: #ff6b35; margin-top: 0;">📋 예약 상세 정보</h3>
          
          <div class="detail-row">
            <span class="detail-label">🍽️ 매장</span>
            <span class="detail-value">${restaurantName}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">👤 예약자</span>
            <span class="detail-value">${customerName}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">📅 예약 날짜</span>
            <span class="detail-value">${date}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">🕐 예약 시간</span>
            <span class="detail-value">${time}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">👥 예약 인원</span>
            <span class="detail-value">${partySize}명</span>
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <strong>⚠️ 주의사항</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>예약 시간 15분 전까지 도착해 주세요</li>
            <li>노쇼 시 향후 예약이 제한될 수 있습니다</li>
            <li>예약 변경/취소는 방문 2시간 전까지 가능합니다</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>📞 문의사항이 있으시면 언제든 연락주세요</strong></p>
        <p>전화: 1588-0000 | 이메일: support@restaurant-portal.com</p>
        <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
          맛집 예약 포털 | 서울특별시 강남구 테헤란로 123
        </p>
      </div>
    </body>
    </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'Restaurant Portal <noreply@resend.dev>',
      to: [customerEmail],
      subject: `[${restaurantName}] 예약 확정 안내 - ${date} ${time}`,
      html: emailHtml,
    })

    if (error) {
      console.error('이메일 발송 오류:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    console.log('이메일 발송 성공:', data)
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('이메일 API 오류:', error)
    return NextResponse.json({ 
      success: false, 
      error: '이메일 발송 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}