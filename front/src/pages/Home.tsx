import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCrudApi } from '../hooks/useApi';
import { itemService } from '../services/item';
import type { Item } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  
  const {
    items,
    isLoading,
    error,
    list,
    remove,
  } = useCrudApi<Item, { name: string; quantity: number; description?: string }, any>(itemService);

  useEffect(() => {
    list();
  }, [list]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      await remove(id);
    } catch (err) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Estocando</h1>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white">
                  Itens
                </Link>
                <Link to="/reports" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Relatórios
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Olá, {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Itens em Estoque</h2>
            <Link
              to="/items/new"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Novo Item
            </Link>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              {error.message}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Carregando itens..." />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nenhum item cadastrado</p>
              <Link
                to="/items/new"
                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Criar primeiro item
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            {item.description && (
                              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.quantity} unidades
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Criado em: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <Link
                          to={`/items/${item.id}/edit`}
                          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Editar
                        </Link>
                        <Link
                          to={`/items/${item.id}/adjust`}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Ajustar
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;