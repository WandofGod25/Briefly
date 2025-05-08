export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface Report {
  id?: string
  userId: string
  title?: string
  content: string
  structuredContent: string
  tasks: string[]
  status: 'draft' | 'finalized'
  createdAt: string
  updatedAt: string
  reportId: string
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