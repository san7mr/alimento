import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  cityId: string | null;
  zoneId: string | null;
  setLocation: (cityId: string, zoneId: string) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      cityId: null,
      zoneId: null,
      setLocation: (cityId: string, zoneId: string) => set({ cityId, zoneId }),
      clearLocation: () => set({ cityId: null, zoneId: null }),
    }),
    {
      name: 'alimento-location',
    }
  )
);