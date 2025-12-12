import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { createContext } from "react";
import { useContext } from "react";

import { HostModel } from "@/types/models.ts";
import API, { RequestError } from "@/services/api.ts";

interface HostsProviderProps {
  children: React.ReactNode;
}

interface HostsContextType {
  hosts: HostModel[];
  loading: boolean;
  error: string | null;
  setFetch: (fetch: boolean) => void;
}

const HostsContext = createContext<HostsContextType | undefined>(undefined);

export function HostsProvider(props: HostsProviderProps) {
  const [hosts, setHosts] = useState<HostModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetch, setFetch] = useState<boolean>(true);

  useEffect(() => {
    if (!fetch) return;

    API.getHosts()
      .then((hosts) => {
        setHosts(hosts);
        setLoading(false);
        setFetch(false);
      })
      .catch((e) => {
        if (e instanceof RequestError) setError(e.message);
        else if (e instanceof Error) setError(e.message);
        else setError("Unknown error");
        setLoading(false);
      });
  }, [fetch]);

  const memoValue = useMemo(
    () => ({
      hosts,
      loading,
      error,
      setFetch,
    }),
    [hosts, loading, error, setFetch],
  );

  return (
    <HostsContext.Provider value={memoValue}>
      {props.children}
    </HostsContext.Provider>
  );
}

const useHostsContext = (): HostsContextType => {
  const context = useContext(HostsContext);

  if (!context)
    throw new Error("useHostsContext context must be use inside HostsProvider");

  return context;
};

export default useHostsContext;
