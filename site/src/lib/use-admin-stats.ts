import {
  type AdminError,
  AdminRequestError,
  deleteQuestion,
  fetchStats,
  readToken,
  saveToken,
  type Stats,
} from "@/lib/admin-api";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AdminStats {
  token: string;
  stats: Stats | null;
  error: AdminError | null;
  loading: boolean;
  days: number;
  source?: string;
  setDays: (days: number) => void;
  setSource: (source?: string) => void;
  signIn: (token: string) => void;
  signOut: () => void;
  refresh: () => void;
  remove: (id: number) => Promise<void>;
}

const kindOf = (error: unknown): AdminError => (error instanceof AdminRequestError ? error.kind : "unavailable");

/** Le jeton, la période, le filtre de source, et les chiffres qui en découlent. Un jeton refusé est oublié. */
export function useAdminStats(): AdminStats {
  const [token, setToken] = useState(readToken);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<AdminError | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);
  const [source, setSource] = useState<string>();
  const [version, setVersion] = useState(0);
  const latest = useRef(0);

  // Un jeton refusé est oublié : la page revient à l'écran de connexion.
  const reject = useCallback((kind: AdminError) => {
    setError(kind);
    if (kind !== "unauthorized") return;
    saveToken("");
    setToken("");
    setStats(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    const call = ++latest.current;
    setLoading(true);
    fetchStats(token, { days, source })
      .then((next) => {
        if (call !== latest.current) return;
        setStats(next);
        setError(null);
        saveToken(token);
      })
      .catch((reason: unknown) => {
        if (call === latest.current) reject(kindOf(reason));
      })
      .finally(() => {
        if (call === latest.current) setLoading(false);
      });
  }, [token, days, source, version, reject]);

  const signIn = useCallback((next: string) => {
    setError(null);
    setToken(next);
    setVersion((v) => v + 1);
  }, []);

  const signOut = useCallback(() => {
    saveToken("");
    setToken("");
    setStats(null);
    setError(null);
  }, []);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const remove = useCallback(
    async (id: number) => {
      try {
        await deleteQuestion(token, id);
      } catch (reason: unknown) {
        reject(kindOf(reason));
        return;
      }
      setStats((current) =>
        current && { ...current, recentQuestions: current.recentQuestions.filter((row) => row.id !== id) },
      );
    },
    [token, reject],
  );

  return { token, stats, error, loading, days, source, setDays, setSource, signIn, signOut, refresh, remove };
}
