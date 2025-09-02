export interface Restaurant {
  id: string
  name: string
  description?: string
  address: string
  phone: string
  email?: string
  capacity: number
  openTime: string
  closeTime: string
  createdAt: Date
  updatedAt: Date
}

export interface Table {
  id: string
  restaurantId: string
  number: number
  capacity: number
  isAvailable: boolean
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  preferredContactMethod: 'phone' | 'email'
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  restaurantId: string
  customerId: string
  tableId: string
  date: Date
  time: string
  partySize: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = Booking['status']