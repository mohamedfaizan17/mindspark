// API utilities for future backend integration
// This file contains helper functions for making API calls

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Generic API call function
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Skills assessment API calls (for future backend integration)
export const saveSkillsAssessment = async (assessment: {
  skills: Array<{ name: string; level: number }>
  interests: string[]
  experience: string
}) => {
  return apiCall('/skills-assessments', {
    method: 'POST',
    body: JSON.stringify(assessment),
  })
}

export const getSkillsAssessment = async () => {
  return apiCall('/skills-assessments/latest')
}

// Resume analysis API calls
export const saveResumeAnalysis = async (analysis: {
  fileName?: string
  fileType?: string
  resumeText: string
  extractedSkills: string[]
  experienceLevel?: string
  education: string[]
  summary?: string
  recommendations: string[]
  extractedInfo: any
}) => {
  return apiCall('/resume-analyses', {
    method: 'POST',
    body: JSON.stringify(analysis),
  })
}

export const getResumeAnalyses = async () => {
  return apiCall('/resume-analyses')
}

export const getLatestResumeAnalysis = async () => {
  return apiCall('/resume-analyses/latest')
}
