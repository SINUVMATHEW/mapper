import { ReactNode } from "react";

export interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}



export interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}


export interface AuthProviderProps {
  children: ReactNode; 
}