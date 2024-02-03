import { PropsWithChildren, createContext, useState } from "react";

interface Auth {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
  createdAt: Date;
  accessToken: string;
}

interface AuthContext {
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
}

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<Auth | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
