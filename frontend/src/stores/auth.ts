import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { supabase } from '@/services/supabase'
import { defaultNecessities } from '@/data/defaultNecessities'
import { useNecessityStore } from './necessity'

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      // Add default household necessities for new users
      if (data.user) {
        const necessityStore = useNecessityStore()

        // Wait a bit for the user session to be fully established
        setTimeout(async () => {
          for (const item of defaultNecessities) {
            try {
              await necessityStore.addItem({
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                priority: item.priority,
                notes: item.notes,
                price: 0,
                currency: 'USD',
                productUrl: '',
                addToCartUrl: '',
              })
            } catch (err) {
              console.error(`Failed to add default item ${item.name}:`, err)
            }
          }
        }, 2000)
      }
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
