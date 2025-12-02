import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemService } from '../services/item';
import { updateItemSchema } from '../schemas';
import { type UpdateItemInput } from '../schemas';
import {type Item } from '../types';

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await itemService.get(id!);
        setItem(data);
        setName(data.name);
        setDescription(data.description || '');
        setQuantity(data.quantity);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data: UpdateItemInput = { name, quantity, description };
    const validation = updateItemSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      await itemService.update(id!, data);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!item) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Editar Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min="0"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Salvar</button>
      </form>
      <button onClick={() => navigate('/')}>Cancelar</button>
    </div>
  );
};

export default EditItem;