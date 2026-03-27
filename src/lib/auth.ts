import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthResult {
  user?: User
  token?: string
  error?: string
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export const signUp = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResult> => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      }
    })

    // Generate token
    const token = generateToken(user.id)

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
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  } catch {
    return null
  }
}
