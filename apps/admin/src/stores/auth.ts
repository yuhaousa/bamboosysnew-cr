import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface AuthUser {
  id: string
  email: string
  role: string
  name: string
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }))
      throw new Error((err as { error: string }).error)
    }

    const { data } = await res.json() as { data: { token: string; user: AuthUser } }
    token.value = data.token
    user.value = data.user
    localStorage.setItem('auth_token', data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      if (!res.ok) { logout(); return }
      const { data } = await res.json() as { data: AuthUser }
      user.value = data
    } catch {
      logout()
    }
  }

  return { token, user, isAuthenticated, login, logout, fetchMe }
})
