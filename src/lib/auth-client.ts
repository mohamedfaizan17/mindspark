// Client-side authentication service
export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResult {
  user?: User
  token?: string
  error?: string
}

// For now, we'll use a simple in-memory storage with localStorage
// In a real app, these would be API calls to your backend

const USERS_KEY = 'app_users'
const CURRENT_USER_KEY = 'current_user'

// Simple hash function for demo purposes (NOT secure for production)
const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

const generateToken = (userId: string): string => {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
}

const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp < Date.now()) return null
    return { userId: decoded.userId }
  } catch {
    return null
  }
}

const getUsers = (): Record<string, any> => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : {}
}

const saveUsers = (users: Record<string, any>): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const signUp = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResult> => {
  try {
    const users = getUsers()
    
    // Check if user already exists
    const existingUser = Object.values(users).find((user: any) => user.email === email)
    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Create new user
    const userId = generateId()
    const hashedPassword = simpleHash(password) // Simple hash for demo
    const now = new Date().toISOString()
    
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      createdAt: now,
      updatedAt: now
    }

    users[userId] = user
    saveUsers(users)

    // Generate token
    const token = generateToken(userId)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: 'Failed to create account' }
  }
}

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const users = getUsers()
    const hashedPassword = simpleHash(password)
    
    // Find user
    const user = Object.values(users).find((user: any) => 
      user.email === email && user.password === hashedPassword
    ) as any

    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Generate token
    const token = generateToken(user.id)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  } catch (error) {
    console.error('Sign in error:', error)
    return { error: 'Failed to sign in' }
  }
}

export const getCurrentUser = async (token: string): Promise<User | null> => {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    const users = getUsers()
    const user = users[decoded.userId]
    
    if (!user) return null

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch {
    return null
  }
}
