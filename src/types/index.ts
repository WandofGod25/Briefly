export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface Report {
  id: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
  tasks?: Task[]
}

export interface Task {
  id: string
  reportId: string
  content: string
  status: 'pending' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface RecordingConfig {
  sampleRate: number
  channels: number
  volume: number
  audioType: string
} 