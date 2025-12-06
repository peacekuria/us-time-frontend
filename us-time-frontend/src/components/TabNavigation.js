import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'assessment', label: 'Self Assessment', icon: '📝' },
    { id: 'disorders', label: 'Browse Disorders', icon: '🔍' },
    { id: 'results', label: 'My Results', icon: '📊' },
  ];

  return (
    <nav className="tab-navigation">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {activeTab === tab.id && <div className="active-indicator"></div>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;