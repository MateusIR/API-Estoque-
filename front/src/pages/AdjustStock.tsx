import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemService } from '../services/item';
import { adjustStockSchema } from '../schemas';
import { type AdjustStockInput } from '../schemas';
import { useAuth } from '../contexts/AuthContext';

const AdjustStock: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    const data: AdjustStockInput = { type, quantity, userId: user.id };
    const validation = adjustStockSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      await itemService.adjustStock(id!, data);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Ajustar Estoque</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipo:</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'IN' | 'OUT')}>
            <option value="IN">Entrada</option>
            <option value="OUT">Saída</option>
          </select>
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min="1"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Ajustar</button>
      </form>
      <button onClick={() => navigate('/')}>Cancelar</button>
    </div>
  );
};

export default AdjustStock;