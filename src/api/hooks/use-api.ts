import { useState, useEffect } from 'react';

export const useAPI = <T>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fetchFn]);

  return { data, loading, error };
};
