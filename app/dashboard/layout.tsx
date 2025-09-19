// 대시보드 레이아웃 비활성화 - 2025-09-19
// CustomerPortal이 자체적으로 완전한 레이아웃을 제공하므로 추가 레이아웃 불필요
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CustomerPortal은 자체 헤더와 스타일링을 가지고 있으므로 단순 패스스루
  return <>{children}</>
}