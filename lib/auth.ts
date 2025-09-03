import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  name: string
  email: string
  phone: string
}

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

// 회원가입 함수
export const registerUser = async (userData: RegisterData): Promise<{
  success: boolean
  message: string
  user?: User
}> => {
  try {
    // 이메일 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      return {
        success: false,
        message: '이미 가입된 이메일입니다.'
      }
    }

    // 비밀번호 해싱
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

    // 사용자 저장
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('회원가입 DB 오류:', error)
      return {
        success: false,
        message: '회원가입 중 오류가 발생했습니다.'
      }
    }

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone
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
  user?: User
}> => {
  try {
    // 사용자 찾기
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', loginData.email)
      .single()

    if (error || !user) {
      return {
        success: false,
        message: '존재하지 않는 이메일입니다.'
      }
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(loginData.password, user.password)
    
    if (!isValidPassword) {
      return {
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      }
    }

    return {
      success: true,
      message: '로그인 성공',
      user: {
        id: user.id,
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

// 사용자 ID로 사용자 정보 가져오기
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return null
  }
}