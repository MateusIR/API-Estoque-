import React, { useEffect, useState } from 'react';
import { reportService } from '../services/report';
import { useAuth } from '../contexts/AuthContext';
import type { Item, StockAdjustment, RequestLog } from '../types';
import Navbar from '../components/Navbar';
import '../App.css';



const LOW_STOCK = 10 as number;

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'logs'>('reports');
  const [stockLevels, setStockLevels] = useState<Item[]>([]);
  const [recentAdjustments, setRecentAdjustments] = useState<StockAdjustment[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [logsCount, setLogsCount] = useState<number>(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logFilters, setLogFilters] = useState({
    method: 'ALL',
    status: 'ALL',
    minDuration: 0
  });
  const { user, logout } = useAuth();

  const fetchData = async () => {
    try {
      setError('');
      const [levels, adjustments, logsData] = await Promise.all([
        reportService.getStockLevels(),
        reportService.getRecentAdjustments(10),
        reportService.getLogs(logsCount),
      ]);
      setStockLevels(levels);
      setRecentAdjustments(adjustments);
      setLogs(logsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const logsData = await reportService.getLogs(logsCount);
      setLogs(logsData);
    } catch (err: any) {
      setError('Erro ao carregar logs');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [logsCount, activeTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleLogsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 100) {
      setLogsCount(value);
    }
  };

  const handleLogsCountSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLogsCount(value);
  };

  // Calcular estatísticas
  const totalItems = stockLevels.length;
  const totalStock = stockLevels.reduce((sum, item) => sum + item.quantity, 0);
  const outOfStockItems = stockLevels.filter(item => item.quantity === 0).length;
  const lowStockItems = stockLevels.filter(item => item.quantity > 0 && item.quantity <= LOW_STOCK).length;

  // Estatísticas dos logs
  const totalLogs = logs.length;
  const successLogs = logs.filter(log => log.status >= 200 && log.status < 300).length;
  const errorLogs = logs.filter(log => log.status >= 400).length;
  const avgDuration = logs.length > 0 
    ? Math.round(logs.reduce((sum, log) => sum + log.durationMs, 0) / logs.length)
    : 0;

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    if (logFilters.method !== 'ALL' && log.method !== logFilters.method) return false;
    if (logFilters.status !== 'ALL') {
      if (logFilters.status === 'SUCCESS' && (log.status < 200 || log.status >= 300)) return false;
      if (logFilters.status === 'ERROR' && log.status < 400) return false;
      if (logFilters.status === 'REDIRECT' && (log.status < 300 || log.status >= 400)) return false;
    }
    if (logFilters.minDuration > 0 && log.durationMs < logFilters.minDuration) return false;
    return true;
  });

  // Métodos únicos para filtro
  const uniqueMethods = Array.from(new Set(logs.map(log => log.method)));

  // Função para determinar o nível de estoque
  const getStockLevel = (quantity: number) => {
  const q = Number(quantity);
  if (q === 0) return 'out-of-stock'; 
  if (q <= LOW_STOCK) return 'medium';
  return 'high';
};

  // Função para determinar a cor do método HTTP
  const getMethodColor = (method: string) => {
    switch(method.toUpperCase()) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      case 'PATCH': return 'method-patch';
      default: return 'method-get';
    }
  };

  // Função para determinar a cor do status HTTP
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-warning';
    return 'status-error';
  };

  if (loading) {
    return (
      <div className="main-container">
        <Navbar showlinks={true} user={user || undefined} showLogout={true} onLogout={logout} />
        <div className="reports-container">
          <div className="loading-container">
            <p style={{ color: 'var(--text-light-secondary)' }}>Carregando relatórios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <Navbar showlinks={true} user={user || undefined} showLogout={true} onLogout={logout} />

      <div className="reports-container">
        {/* Cabeçalho */}
        <div className="reports-header">
          <h1 className="reports-title">Relatórios</h1>
          <p className="reports-subtitle">
            Veja análises e estatísticas do seu estoque
          </p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Abas */}
        <div className="reports-tabs">
          <button 
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
              assessment
            </span>
            Relatórios
          </button>
          <button 
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
              list_alt
            </span>
            Logs do Sistema
          </button>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'reports' ? (
          <div className="tab-content">
            {/* Cartões de resumo */}
            <div className="reports-summary">
              <div className="summary-card">
                <div className="summary-card-title">Total de Itens</div>
                <div className="summary-card-value">{totalItems}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-title">Estoque Total</div>
                <div className="summary-card-value">{totalStock}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-title">Itens em Falta</div>
                <div className="summary-card-value">{outOfStockItems}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-title">Estoque Baixo</div>
                <div className="summary-card-value">{lowStockItems}</div>
              </div>
            </div>

            {/* Botão de atualizar */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <button 
                onClick={handleRefresh}
                className="refresh-button"
                disabled={isRefreshing}
              >
                <span className="material-symbols-outlined">
                  {isRefreshing ? 'refresh' : 'refresh'}
                </span>
                {isRefreshing ? 'Atualizando...' : 'Atualizar Relatórios'}
              </button>
            </div>

            {/* Grid de relatórios */}
            <div className="reports-grid">
              {/* Relatório de níveis de estoque */}
              <div className="report-card">
                <div className="report-card-header">
                  <h3 className="report-card-title">Níveis de Estoque</h3>
                  <span className="report-card-count">{stockLevels.length}</span>
                </div>
                
                {stockLevels.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-symbols-outlined empty-state-icon">
                      inventory_2
                    </span>
                    <p>Nenhum item cadastrado</p>
                  </div>
                ) : (
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockLevels.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div style={{ fontWeight: 500 }}>{item.name}</div>
                            {item.description && (
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-light-secondary)',
                                marginTop: '0.25rem'
                              }}>
                                {item.description.length > 30 
                                  ? `${item.description.substring(0, 30)}...` 
                                  : item.description}
                              </div>
                            )}
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            <div className={`stock-level stock-level-${getStockLevel(item.quantity)}`}>
                              <div className="stock-level-bar">
                                <div className="stock-level-fill" />
                              </div>
                              <span className="stock-level-text">
                                {item.quantity === 0 ? 'Esgotado' : 
                                item.quantity <= LOW_STOCK ? 'Baixo' : 'Normal'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Relatório de ajustes recentes */}
              <div className="report-card">
                <div className="report-card-header">
                  <h3 className="report-card-title">Ajustes Recentes</h3>
                  <span className="report-card-count">{recentAdjustments.length}</span>
                </div>
                
                {recentAdjustments.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-symbols-outlined empty-state-icon">
                      trending_up
                    </span>
                    <p>Nenhum ajuste registrado</p>
                  </div>
                ) : (
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAdjustments.map(adj => (
                        <tr key={adj.id}>
                          <td>{adj.item?.name || 'Item não encontrado'}</td>
                          <td>
                            <span className={`type-badge type-${adj.type.toLowerCase()}`}>
                              {adj.type === 'IN' ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{adj.quantity}</td>
                          <td style={{ fontSize: '0.75rem' }}>
                            {new Date(adj.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            {/* Controles de logs */}
            <div className="logs-controls">
              <div className="logs-count-control">
                <span className="logs-count-label">Quantidade de Logs:</span>
                <input
                  type="number"
                  value={logsCount}
                  onChange={handleLogsCountChange}
                  min="0"
                  max="100"
                  className="logs-count-input"
                />
                <div className="logs-count-slider">
                  <input
                    type="range"
                    value={logsCount}
                    onChange={handleLogsCountSliderChange}
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>

              <div className="logs-stats">
                <div className="log-stat">
                  <div className="log-stat-value">{totalLogs}</div>
                  <div className="log-stat-label">Total</div>
                </div>
                <div className="log-stat">
                  <div className="log-stat-value" style={{ color: 'var(--primary)' }}>{successLogs}</div>
                  <div className="log-stat-label">Sucesso</div>
                </div>
                <div className="log-stat">
                  <div className="log-stat-value" style={{ color: '#ff3b30' }}>{errorLogs}</div>
                  <div className="log-stat-label">Erros</div>
                </div>
                <div className="log-stat">
                  <div className="log-stat-value">{avgDuration}ms</div>
                  <div className="log-stat-label">Média</div>
                </div>
              </div>
            </div>

            {/* Filtros de logs */}
            <div className="logs-filters">
              <div className="filter-group">
                <label className="filter-label">Método HTTP</label>
                <select
                  className="filter-select"
                  value={logFilters.method}
                  onChange={(e) => setLogFilters({...logFilters, method: e.target.value})}
                >
                  <option value="ALL">Todos</option>
                  {uniqueMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="filter-select"
                  value={logFilters.status}
                  onChange={(e) => setLogFilters({...logFilters, status: e.target.value})}
                >
                  <option value="ALL">Todos</option>
                  <option value="SUCCESS">Sucesso (2xx)</option>
                  <option value="REDIRECT">Redirecionamento (3xx)</option>
                  <option value="ERROR">Erro (4xx, 5xx)</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Duração Mínima (ms)</label>
                <select
                  className="filter-select"
                  value={logFilters.minDuration}
                  onChange={(e) => setLogFilters({...logFilters, minDuration: parseInt(e.target.value)})}
                >
                  <option value="0">Qualquer</option>
                  <option value="100">100ms+</option>
                  <option value="500">500ms+</option>
                  <option value="1000">1s+</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  className="refresh-button"
                  onClick={fetchLogs}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    refresh
                  </span>
                  Atualizar
                </button>
              </div>
            </div>

            {/* Tabela de logs */}
            {filteredLogs.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem' }}>
                <span className="material-symbols-outlined empty-state-icon">
                  search_off
                </span>
                <p>Nenhum log encontrado com os filtros atuais</p>
                <button
                  className="empty-state-button"
                  onClick={() => {
                    setLogFilters({ method: 'ALL', status: 'ALL', minDuration: 0 });
                    fetchLogs();
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="logs-table-container">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Método</th>
                      <th>Path</th>
                      <th>Status</th>
                      <th>Tempo</th>
                      <th>Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td>
                          <span className={`log-method ${getMethodColor(log.method)}`}>
                            {log.method}
                          </span>
                        </td>
                        <td>
                          <div className="log-path">{log.path}</div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td>
                          <div className="log-time">{log.durationMs}ms</div>
                        </td>
                        <td>
                          <div className="log-date">
                            {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="log-date" style={{ marginTop: '0.25rem' }}>
                            {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Informações de paginação */}
            <div className="logs-pagination">
              <div className="pagination-info">
                Mostrando {filteredLogs.length} de {logs.length} logs
              </div>
              <div className="pagination-info">
                Logs carregados: {logsCount}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;