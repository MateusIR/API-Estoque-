import { useState, useCallback } from 'react';

type ApiFunction<T, P extends any[]> = (...args: P) => Promise<T>;

interface UseApiOptions<T, P extends any[]> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
  initialParams?: P;
}

export function useApi<T, P extends any[]>(
  apiFunction: ApiFunction<T, P>,
  options: UseApiOptions<T, P> = {}
) {
  const { onSuccess, onError, immediate = false, initialParams = [] as unknown as P } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...args: P) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(err.message || 'Erro desconhecido');
      setError(errorObj);
      onError?.(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  // Executar imediatamente se necessário
  useState(() => {
    if (immediate && initialParams) {
      execute(...initialParams);
    }
  });

  return {
    data,
    error,
    isLoading,
    execute,
    setData,
    setError,
  };
}

// Hook para operações de CRUD
export function useCrudApi<T extends { id: string }, CreateDto, UpdateDto>(
  service: {
    create: (data: CreateDto) => Promise<T>;
    list: () => Promise<T[]>;
    get: (id: string) => Promise<T>;
    update: (id: string, data: UpdateDto) => Promise<T>;
    delete: (id: string) => Promise<void>;
  }
) {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const list = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.list();
      setItems(data);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const get = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.get(id);
      setSelectedItem(data);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const create = useCallback(async (data: CreateDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await service.create(data);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const update = useCallback(async (id: string, data: UpdateDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await service.update(id, data);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      if (selectedItem?.id === id) {
        setSelectedItem(updatedItem);
      }
      return updatedItem;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service, selectedItem]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await service.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service, selectedItem]);

  return {
    items,
    selectedItem,
    isLoading,
    error,
    list,
    get,
    create,
    update,
    remove,
    setItems,
    setSelectedItem,
  };
}