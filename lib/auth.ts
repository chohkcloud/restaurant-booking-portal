import { UserInfo } from '@/components/auth/LoginModal'

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

// 사용자 데이터베이스 시뮬레이션 (실제 서비스에서는 실제 DB 사용)
export const getUserDatabase = (): RegisterData[] => {
  const stored = localStorage.getItem('userDatabase')
  return stored ? JSON.parse(stored) : []
}

export const saveUserToDatabase = (user: RegisterData): void => {
  const users = getUserDatabase()
  users.push(user)
  localStorage.setItem('userDatabase', JSON.stringify(users))
}

export const findUserByEmail = (email: string): RegisterData | null => {
  const users = getUserDatabase()
  return users.find(user => user.email === email) || null
}

// 회원가입 함수
export const registerUser = async (userData: RegisterData): Promise<{
  success: boolean
  message: string
  user?: UserInfo
}> => {
  try {
    // 이메일 중복 확인
    const existingUser = findUserByEmail(userData.email)
    if (existingUser) {
      return {
        success: false,
        message: '이미 가입된 이메일입니다.'
      }
    }

    // 사용자 저장
    saveUserToDatabase(userData)
    
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      }
    }
  } catch (error) {
    console.error('회원가입 오류:', error)
    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다.'
    }
  }
}

// 로그인 함수
export const loginUser = async (loginData: LoginData): Promise<{
  success: boolean
  message: string
  user?: UserInfo
}> => {
  try {
    // 사용자 찾기
    const user = findUserByEmail(loginData.email)
    
    if (!user) {
      return {
        success: false,
        message: '존재하지 않는 이메일입니다.'
      }
    }

    // 비밀번호 확인
    if (user.password !== loginData.password) {
      return {
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      }
    }

    return {
      success: true,
      message: '로그인 성공',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    }
  }
}