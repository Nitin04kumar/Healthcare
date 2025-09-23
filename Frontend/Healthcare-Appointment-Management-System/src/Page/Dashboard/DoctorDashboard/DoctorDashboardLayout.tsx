// components/DoctorDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Clock, 
  History, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import './Layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Notification from '../../../Components/Dashboard/doctor/DocNotification';
import assetsData from '../../../assets/assetsData';
import { logout } from '../../../api/authService';
import toast from 'react-hot-toast';


interface DoctorDashboardLayoutProps {
  children: React.ReactNode;
}

const DoctorDashboardLayout: React.FC<DoctorDashboardLayoutProps> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Update the activeTab state based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('profile')) setActiveTab('Home');
    else if (path.includes('appointments')) setActiveTab('ManageAppointment');
    else if (path.includes('availability')) setActiveTab('Availability');
    else if (path.includes('patient-history')) setActiveTab('PatientHistory');
  }, [location]);

  // Check screen size for responsiveness
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
        setIsMobileSidebarOpen(false); // Close mobile sidebar when resizing to desktop
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  const handleTabClick = (tabName: string) => {
    if (tabName === 'Home') navigate('/dashboard/doctor/profile');
    else if (tabName === 'ManageAppointment') navigate('/dashboard/doctor/appointments');
    else if (tabName === 'Availability') navigate('/dashboard/doctor/availability');
    else if (tabName === 'PatientHistory') navigate('/dashboard/doctor/patient-history');
    else if (tabName === 'Logout') handleLogout();
    
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logging out...');
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

  const sidebarTabs = [
    { id: 'Home', name: 'Home', icon: Home },
    { id: 'ManageAppointment', name: 'Manage Appointment', icon: Calendar },
    { id: 'Availability', name: 'Availability', icon: Clock },
    { id: 'PatientHistory', name: 'Patient History', icon: History },
    { id: 'Logout', name: 'Logout', icon: LogOut, isAction: true },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="header-title">Healthcare Dashboard</h1>
        </div>
        <div className="header-right">
          <Notification /> {/* Integrated Notification Component */}
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Link to="/" className='sidebar-logo-link'>
            <img src={assetsData.logo} alt="Healthcare Logo" />
            {isSidebarExpanded && <span>Healthcare</span>}
            </Link>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {sidebarTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <li key={tab.id} className="nav-item">
                  <button
                    className={`nav-link ${activeTab === tab.id ? 'active' : ''} ${tab.isAction ? 'action-btn' : ''}`}
                    onClick={() => tab.isAction ? handleLogout() : handleTabClick(tab.id)}
                  >
                    <IconComponent size={20} />
                    {isSidebarExpanded && <span>{tab.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="dashboard-main">
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboardLayout;