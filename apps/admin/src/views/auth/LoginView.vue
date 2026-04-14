<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
    <div class="w-full max-w-md space-y-8">
      <!-- Brand -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 mb-4">
          <Layers class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">BambooSys CMS</h1>
        <p class="mt-2 text-gray-400 text-sm">Sign in to manage your website</p>
      </div>

      <!-- Login form -->
      <form @submit.prevent="handleLogin" class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-5">
        <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            v-model="email" type="email" required autocomplete="email"
            class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
          <input
            v-model="password" type="password" required autocomplete="current-password"
            class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit" :disabled="loading"
          class="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 transition-colors"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Layers } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
