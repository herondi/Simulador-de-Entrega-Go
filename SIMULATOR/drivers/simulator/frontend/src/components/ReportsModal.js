import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCalendar, 
  FiTrendingUp, 
  FiTruck, 
  FiDollarSign,
  FiClock,
  FiUsers,
  FiDownload,
  FiBarChart3
} from 'react-icons/fi';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
`;

const DatePicker = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ExportButton = styled.button`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ReportCard = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.gradient});
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(20px, -20px);
  }
`;

const ReportIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.9;
`;

const ReportValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ReportLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.75rem;
`;

const ReportChange = styled.div`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.8;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: linear-gradient(45deg, #f0f2f5, #e1e5e9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.875rem;
`;

const TableSection = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e1e5e9;
`;

const TableHeader = styled.div`
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e5e9;
`;

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  font-size: 0.875rem;
`;

const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
  border-bottom: 1px solid #e1e5e9;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  
  &.completed {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
  
  &.pending {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
  
  &.cancelled {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }
`;

const ReportsModal = ({ isOpen, onClose }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    totalRevenue: 0,
    averageDeliveryTime: 0,
    activeDrivers: 0,
    successRate: 0
  });
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchReportData();
    }
  }, [isOpen, dateRange]);

  const fetchReportData = () => {
    // Simular dados de relatório (substitua pela chamada real da API)
    const mockData = {
      totalDeliveries: 156,
      completedDeliveries: 142,
      totalRevenue: 8950.50,
      averageDeliveryTime: 28,
      activeDrivers: 12,
      successRate: 91.0
    };

    const mockDeliveries = [
      {
        id: 1,
        driver: 'João Silva',
        customer: 'Maria Santos',
        value: 45.90,
        status: 'completed',
        date: '2024-01-15',
        time: '32 min'
      },
      {
        id: 2,
        driver: 'Ana Oliveira',
        customer: 'Pedro Costa',
        value: 67.80,
        status: 'completed',
        date: '2024-01-15',
        time: '25 min'
      },
      {
        id: 3,
        driver: 'Roberto Lima',
        customer: 'Carlos Silva',
        value: 89.90,
        status: 'pending',
        date: '2024-01-15',
        time: '-'
      },
      {
        id: 4,
        driver: 'Lucia Santos',
        customer: 'Ana Costa',
        value: 34.50,
        status: 'cancelled',
        date: '2024-01-14',
        time: '-'
      }
    ];

    setReportData(mockData);
    setDeliveries(mockDeliveries);
  };

  const handleExport = () => {
    // Simular exportação
    alert('Relatório exportado com sucesso! O arquivo será baixado em breve.');
  };

  const reportCards = [
    {
      title: 'Total de Entregas',
      value: reportData.totalDeliveries,
      icon: FiTruck,
      gradient: '#667eea, #764ba2',
      change: '+12%'
    },
    {
      title: 'Entregas Concluídas',
      value: reportData.completedDeliveries,
      icon: FiTrendingUp,
      gradient: '#4caf50, #66bb6a',
      change: '+8%'
    },
    {
      title: 'Receita Total',
      value: `R$ ${reportData.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      gradient: '#ff9800, #ffb74d',
      change: '+15%'
    },
    {
      title: 'Tempo Médio',
      value: `${reportData.averageDeliveryTime} min`,
      icon: FiClock,
      gradient: '#9c27b0, #ba68c8',
      change: '-5%'
    },
    {
      title: 'Entregadores Ativos',
      value: reportData.activeDrivers,
      icon: FiUsers,
      gradient: '#2196f3, #64b5f6',
      change: '+3%'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${reportData.successRate}%`,
      icon: FiBarChart3,
      gradient: '#00bcd4, #4dd0e1',
      change: '+2%'
    }
  ];

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Relatórios de Entrega</ModalTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <FilterSection>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCalendar />
                <span>Período:</span>
              </div>
              <DatePicker
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span>até</span>
              <DatePicker
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
              <ExportButton onClick={handleExport}>
                <FiDownload />
                Exportar
              </ExportButton>
            </FilterSection>

            <ReportsGrid>
              {reportCards.map((card, index) => (
                <ReportCard
                  key={index}
                  gradient={card.gradient}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ReportIcon>
                    <card.icon />
                  </ReportIcon>
                  <ReportValue>{card.value}</ReportValue>
                  <ReportLabel>{card.title}</ReportLabel>
                  <ReportChange>
                    <FiTrendingUp />
                    {card.change} vs mês anterior
                  </ReportChange>
                </ReportCard>
              ))}
            </ReportsGrid>

            <ChartsSection>
              <ChartCard>
                <ChartTitle>Entregas por Dia</ChartTitle>
                <ChartPlaceholder>
                  📊 Gráfico de entregas diárias seria exibido aqui
                </ChartPlaceholder>
              </ChartCard>
              
              <ChartCard>
                <ChartTitle>Top Entregadores</ChartTitle>
                <ChartPlaceholder>
                  🏆 Ranking dos entregadores seria exibido aqui
                </ChartPlaceholder>
              </ChartCard>
            </ChartsSection>

            <TableSection>
              <TableHeader>
                <TableTitle>Entregas Recentes</TableTitle>
              </TableHeader>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Entregador</TableHeaderCell>
                    <TableHeaderCell>Cliente</TableHeaderCell>
                    <TableHeaderCell>Valor</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Data</TableHeaderCell>
                    <TableHeaderCell>Tempo</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>#{delivery.id}</TableCell>
                      <TableCell>{delivery.driver}</TableCell>
                      <TableCell>{delivery.customer}</TableCell>
                      <TableCell>R$ {delivery.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge className={delivery.status}>
                          {getStatusText(delivery.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{delivery.date}</TableCell>
                      <TableCell>{delivery.time}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ReportsModal;