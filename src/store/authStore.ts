import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  
  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        await get().fetchUser();
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  },
  
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
  
  fetchUser: async () => {
    set({ isLoading: true });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (!data) {
        // Create a new profile for the user
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email
          }])
          .select('*')
          .single();

        if (profileError) {
          console.error("Error creating profile", profileError);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ 
          user: {
            id: user.id,
            email: user.email!,
            full_name: newProfile.full_name,
            phone_number: newProfile.phone_number,
            avatar_url: newProfile.avatar_url,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ 
          user: {
            id: user.id,
            email: user.email!,
            full_name: data.full_name || user.user_metadata?.full_name,
            phone_number: data.phone_number,
            avatar_url: data.avatar_url,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));