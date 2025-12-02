import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/item';
import {type Item } from '../types';

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.list();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await itemService.delete(id);
        setItems(items.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h1>Itens de Estoque</h1>
      <Link to="/items/new">Adicionar Novo Item</Link>
      <Link to="/reports" style={{ marginLeft: '10px' }}>Relatórios</Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td>{item.quantity}</td>
              <td>
                <Link to={`/items/${item.id}`}>Ver</Link>
                <Link to={`/items/${item.id}/edit`} style={{ marginLeft: '5px' }}>Editar</Link>
                <Link to={`/items/${item.id}/adjust`} style={{ marginLeft: '5px' }}>Ajustar</Link>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '5px' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;