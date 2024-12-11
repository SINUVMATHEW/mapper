import { create } from 'zustand';
import axios from 'axios';
import { baseUrl } from '../services/api/BaseUrl';

interface KeyspaceState {
  keyspaces: string[];
  selectedKeyspace: string;
  isLoading: boolean;
  error: string | null;
  fetchKeyspaces: () => Promise<void>;
  setSelectedKeyspace: (keyspace: string) => void;
}
const useKeyspaceStore = create<KeyspaceState>((set) => ({
  keyspaces: [],
  selectedKeyspace: "",
  isLoading: false,
  error: null,
  fetchKeyspaces: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.get(`${baseUrl}/keyspace_names`);
    const keyspaces = response.data;
    set({
      keyspaces,
      selectedKeyspace: keyspaces.length > 0 ? keyspaces[0] : null,
      isLoading: false,
    });
  } catch (error) {
    set({
      error: (error as Error).message || 'Failed to fetch keyspaces',
      isLoading: false,
    });
  }
},
  setSelectedKeyspace: (keyspace: string) => set({ selectedKeyspace: keyspace }),
}));
export default useKeyspaceStore
