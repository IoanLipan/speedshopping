import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  function initAuth() {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        user.value = {
          id: session.user.id,
          email: session.user.email!,
          displayName: session.user.user_metadata?.display_name || undefined,
          photoURL: session.user.user_metadata?.photo_url || undefined,
          createdAt: new Date(session.user.created_at),
        }
      } else {
        user.value = null
      }
      loading.value = false
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        user.value = {
          id: session.user.id,
          email: session.user.email!,
          displayName: session.user.user_metadata?.display_name || undefined,
          photoURL: session.user.user_metadata?.photo_url || undefined,
          createdAt: new Date(session.user.created_at),
        }
      } else {
        user.value = null
      }
      loading.value = false
    })
  }

  async function login(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async function register(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
  }
})
