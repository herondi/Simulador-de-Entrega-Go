import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiTruck, 
  FiMapPin, 
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import axios from 'axios';

// Import modals
import AddDriverModal from '../components/AddDriverModal';
import NewDeliveryModal from '../components/NewDeliveryModal';
import RoutesModal from '../components/RoutesModal';
import ReportsModal from '../components/ReportsModal';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.positive {
    color: #4caf50;
  }
  
  &.negative {
    color: #f44336;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecentDeliveries = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const DeliveryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateX(4px);
  }
`;

const DeliveryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const DeliveryInfo = styled.div`
  flex: 1;
`;

const DeliveryTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const DeliverySubtitle = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const DeliveryStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  
  &.pending {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
  
  &.in-progress {
    background: rgba(33, 150, 243, 0.1);
    color: #2196f3;
  }
  
  &.completed {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDeliveries: 0,
    completedToday: 0,
    averageTime: 0
  });

  // Modal states
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showNewDeliveryModal, setShowNewDeliveryModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);  
  const [showReportsModal, setShowReportsModal] = useState(false);

  useEffect(() => {
    // Fetch drivers data
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/drivers');
        setDrivers(response.data.drivers || []);
        setStats(prev => ({
          ...prev,
          totalDrivers: response.data.drivers?.length || 0
        }));
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  // Handler functions for modals
  const handleDriverAdded = () => {
    // Refresh drivers list
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/drivers');
        setDrivers(response.data.drivers || []);
        setStats(prev => ({
          ...prev,
          totalDrivers: response.data.drivers?.length || 0
        }));
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  };

  const handleDeliveryCreated = () => {
    // Refresh statistics or deliveries list if needed
    console.log('Nova entrega criada - atualizando dados...');
  };

  const statCards = [
    {
      title: 'Total de Entregadores',
      value: stats.totalDrivers,
      icon: FiUsers,
      color: '#667eea',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Entregas Ativas',
      value: stats.activeDeliveries || 8,
      icon: FiTruck,
      color: '#4caf50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Entregas Hoje',
      value: stats.completedToday || 24,
      icon: FiCheckCircle,
      color: '#ff9800',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Tempo Médio',
      value: `${stats.averageTime || 25} min`,
      icon: FiClock,
      color: '#9c27b0',
      change: '-8%',
      changeType: 'negative'
    }
  ];

  const recentDeliveries = [
    {
      id: 1,
      driver: 'João Silva',
      destination: 'Rua das Flores, 123',
      status: 'in-progress',
      time: '15 min'
    },
    {
      id: 2,
      driver: 'Maria Santos',
      destination: 'Av. Paulista, 1000',
      status: 'pending',
      time: '25 min'
    },
    {
      id: 3,
      driver: 'Pedro Costa',
      destination: 'Rua Augusta, 500',
      status: 'completed',
      time: 'Entregue'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#2196f3';
      case 'completed': return '#4caf50';
      default: return '#666';
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <div>
          <Title>Dashboard</Title>
          <Subtitle>Visão geral do sistema de entregas</Subtitle>
        </div>
      </DashboardHeader>

      <StatsGrid>
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatHeader>
              <StatIcon style={{ background: card.color }}>
                <card.icon />
              </StatIcon>
              <StatChange className={card.changeType}>
                <FiTrendingUp />
                {card.change}
              </StatChange>
            </StatHeader>
            <StatValue>{card.value}</StatValue>
            <StatLabel>{card.title}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <RecentDeliveries>
          <SectionTitle>Entregas Recentes</SectionTitle>
          {recentDeliveries.map((delivery, index) => (
            <DeliveryItem
              key={delivery.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <DeliveryIcon style={{ background: getStatusColor(delivery.status) }}>
                <FiTruck />
              </DeliveryIcon>
              <DeliveryInfo>
                <DeliveryTitle>{delivery.driver}</DeliveryTitle>
                <DeliverySubtitle>{delivery.destination}</DeliverySubtitle>
              </DeliveryInfo>
              <DeliveryStatus className={delivery.status}>
                {delivery.status === 'pending' && 'Pendente'}
                {delivery.status === 'in-progress' && 'Em Andamento'}
                {delivery.status === 'completed' && 'Entregue'}
              </DeliveryStatus>
            </DeliveryItem>
          ))}
        </RecentDeliveries>

        <QuickActions>
          <SectionTitle>Ações Rápidas</SectionTitle>
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddDriverModal(true)}
          >
            <FiUsers />
            Adicionar Entregador
          </ActionButton>
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewDeliveryModal(true)}
          >
            <FiMapPin />
            Nova Entrega
          </ActionButton>
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRoutesModal(true)}
          >
            <FiTruck />
            Ver Rotas
          </ActionButton>
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReportsModal(true)}
          >
            <FiAlertCircle />
            Relatórios
          </ActionButton>
        </QuickActions>
      </ContentGrid>

      {/* Modals */}
      <AddDriverModal
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        onDriverAdded={handleDriverAdded}
      />
      
      <NewDeliveryModal
        isOpen={showNewDeliveryModal}
        onClose={() => setShowNewDeliveryModal(false)}
        onDeliveryCreated={handleDeliveryCreated}
      />
      
      <RoutesModal
        isOpen={showRoutesModal}
        onClose={() => setShowRoutesModal(false)}
      />
      
      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />
    </DashboardContainer>
  );
};

export default Dashboard; 