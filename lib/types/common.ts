export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface FormError {
  field: string
  message: string
}