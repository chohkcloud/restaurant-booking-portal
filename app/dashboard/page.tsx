export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">예약 현황</h2>
          <p className="text-gray-600">오늘의 예약을 확인하세요</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">테이블 관리</h2>
          <p className="text-gray-600">테이블 상태를 관리하세요</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">고객 관리</h2>
          <p className="text-gray-600">고객 정보를 관리하세요</p>
        </div>
      </div>
    </div>
  )
}