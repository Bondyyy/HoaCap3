import { createContext, useContext, useEffect, useState } from "react";
import { currentUser } from "../services/storage";
import type { User } from "../types";
const Context = createContext<{ user: User | null; revision: number }>({
  user: null,
  revision: 0,
});
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const fn = () => setRevision((x) => x + 1);
    window.addEventListener("amino-data", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("amino-data", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  return (
    <Context.Provider value={{ user: currentUser(), revision }}>
      {children}
    </Context.Provider>
  );
}
export const useUser = () => useContext(Context);
