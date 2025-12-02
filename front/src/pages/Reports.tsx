import React, { useEffect, useState } from 'react';
import { reportService } from '../services/report';
import type { Item, StockAdjustment, RequestLog } from '../types';

const Reports: React.FC = () => {
  const [stockLevels, setStockLevels] = useState<Item[]>([]);
  const [recentAdjustments, setRecentAdjustments] = useState<StockAdjustment[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levels, adjustments, logsData] = await Promise.all([
          reportService.getStockLevels(),
          reportService.getRecentAdjustments(10),
          reportService.getLogs(10),
        ]);
        setStockLevels(levels);
        setRecentAdjustments(adjustments);
        setLogs(logsData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Relatórios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Níveis de Estoque</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {stockLevels.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ajustes Recentes</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Usuário</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {recentAdjustments.map(adj => (
            <tr key={adj.id}>
              <td>{adj.item?.name}</td>
              <td>{adj.type}</td>
              <td>{adj.quantity}</td>
              <td>{adj.user?.name}</td>
              <td>{new Date(adj.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Logs de Requisições</h2>
      <table>
        <thead>
          <tr>
            <th>Método</th>
            <th>Path</th>
            <th>Status</th>
            <th>Duração (ms)</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.method}</td>
              <td>{log.path}</td>
              <td>{log.status}</td>
              <td>{log.durationMs}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;