import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiMap, 
  FiTruck, 
  FiBarChart, 
  FiSettings,
  FiLogOut 
} from 'react-icons/fi';

const SidebarContainer = styled(motion.nav)`
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const CompanyName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const CompanySubtitle = styled.p`
  font-size: 0.875rem;
  color: #666;
  font-weight: 400;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin: 0.5rem 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 2rem;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: white;
      border-radius: 0 2px 2px 0;
    }
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled.span`
  font-weight: 500;
  font-size: 0.95rem;
`;

const SidebarFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 1rem;
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.2);
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(244, 67, 54, 0.2);
    transform: translateY(-2px);
  }
`;

const menuItems = [
  { path: '/', icon: FiHome, text: 'Dashboard' },
  { path: '/drivers', icon: FiUsers, text: 'Entregadores' },
  { path: '/map', icon: FiMap, text: 'Mapa de Entregas' },
  { path: '/deliveries', icon: FiTruck, text: 'Entregas' },
  { path: '/analytics', icon: FiBarChart, text: 'Analytics' },
  { path: '/settings', icon: FiSettings, text: 'Configurações' },
];

const Sidebar = () => {
  return (
    <SidebarContainer
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SidebarHeader>
        <CompanyName>Delivery Manager</CompanyName>
        <CompanySubtitle>Sistema Multi-Empresa</CompanySubtitle>
      </SidebarHeader>
      
      <NavMenu>
        {menuItems.map((item, index) => (
          <NavItem key={item.path}>
            <NavLinkStyled 
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <NavIcon>
                <item.icon size={18} />
              </NavIcon>
              <NavText>{item.text}</NavText>
            </NavLinkStyled>
          </NavItem>
        ))}
      </NavMenu>
      
      <SidebarFooter>
        <LogoutButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiLogOut size={18} />
          Sair do Sistema
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar; 