import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { itemService } from '../services/item';
import { adjustStockSchema } from '../schemas';
import { type AdjustStockInput } from '../schemas';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import '../App.css';

const AdjustStock: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState(1);
  const [itemName, setItemName] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Carregar informações do item
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const item = await itemService.get(id);
        setItemName(item.name);
        setCurrentStock(item.quantity);
      } catch (err: any) {
        setError('Erro ao carregar informações do item');
      }
    };

    fetchItem();
  }, [id]);

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
      if (!id) throw new Error('ID do item não encontrado');
      await itemService.adjustStock(id, data);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao ajustar estoque');
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleQuantityQuick = (value: number) => {
    setQuantity(value);
  };

  const calculatedStock = type === 'IN' 
    ? currentStock + quantity 
    : currentStock - quantity;

  const isOutOfStock = type === 'OUT' && quantity > currentStock;

  return (
    <div className="main-container">
       <Navbar showlinks={true}  showLogout={false}  />

      {/* Conteúdo principal */}
      <div className="adjust-stock-container">
        <div className="adjust-stock-content">
          {/* Cabeçalho */}
          <div className="adjust-stock-header">
            <h1 className="adjust-stock-title">Ajustar Estoque</h1>
            <Link 
              to="/"
              className="back-button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar
            </Link>
          </div>

          <p className="adjust-stock-subtitle">
            Ajustando estoque do item: <strong>{itemName}</strong>
          </p>

          <form onSubmit={handleSubmit} className="adjust-stock-form">
            {/* Mensagem de erro */}
            {error && (
              <div className="item-form-error">
                {error}
              </div>
            )}

            {/* Tipo de ajuste */}
            <div className="form-group">
              <label className="form-label">Tipo de Ajuste</label>
              <div className="stock-type-selector">
                <button
                  type="button"
                  className={`stock-type-button ${type === 'IN' ? 'active' : ''}`}
                  onClick={() => setType('IN')}
                >
                  <span className="material-symbols-outlined stock-type-icon">
                    add_circle
                  </span>
                  Entrada
                </button>
                <button
                  type="button"
                  className={`stock-type-button ${type === 'OUT' ? 'active' : ''}`}
                  onClick={() => setType('OUT')}
                  // ALTERADO: Estilo condicional para o botão de Saída
                  style={type === 'OUT' ? { 
                    backgroundColor: '#ef4444', 
                    borderColor: '#ef4444', 
                    color: 'white' 
                  } : {}}
                >
                  <span className="material-symbols-outlined stock-type-icon">
                    remove_circle
                  </span>
                  Saída
                </button>
              </div>
            </div>

            {/* Quantidade */}
            <div className="form-group">
              <label className="quantity-input-label">Quantidade</label>
              <div className="quantity-input-container">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="quantity-input"
                  required
                  min="1"
                />
              </div>
              
              {/* Botões rápidos de quantidade */}
              <div className="quantity-buttons">
                <button type="button" className="quantity-button" onClick={() => handleQuantityQuick(1)}>1</button>
                <button type="button" className="quantity-button" onClick={() => handleQuantityQuick(5)}>5</button>
                <button type="button" className="quantity-button" onClick={() => handleQuantityQuick(10)}>10</button>
                <button type="button" className="quantity-button" onClick={() => handleQuantityQuick(50)}>50</button>
              </div>
            </div>

            {/* Resumo do ajuste */}
            <div className="stock-summary">
              <h3 className="summary-title">Resumo do Ajuste</h3>
              
              <div className="summary-item">
                <span>Estoque Atual:</span>
                <span className="summary-value">{currentStock} unidades</span>
              </div>
              
              <div className="summary-item">
                <span>Tipo de Ajuste:</span>
                <span className="summary-value">
                  {type === 'IN' ? 'Entrada (+) ' : 'Saída (-) '}
                  {quantity} unidades
                </span>
              </div>
              
              <div className="summary-total">
                <span>Novo Estoque:</span>
                <span style={{ 
                  color: isOutOfStock ? '#ff3b30' : 'var(--primary)'
                }}>
                  {calculatedStock} unidades
                </span>
              </div>

              {isOutOfStock && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  borderRadius: '0.375rem',
                  color: '#ff3b30',
                  fontSize: '0.875rem'
                }}>
                   Atenção: Esta operação deixará o estoque negativo!
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="form-buttons">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="form-button form-button-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="form-button form-button-primary"
                disabled={isOutOfStock}
                style={{
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  backgroundColor: type === 'OUT' ? '#ef4444' : 'var(--primary)',
                  borderColor: type === 'OUT' ? '#ef4444' : 'var(--primary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ 
                  verticalAlign: 'middle',
                  marginRight: '0.5rem'
                }}>
                  {type === 'IN' ? 'add' : 'remove'}
                </span>
                Confirmar {type === 'IN' ? 'Entrada' : 'Saída'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdjustStock;