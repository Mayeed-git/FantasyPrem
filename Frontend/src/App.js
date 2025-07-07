
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, Trophy, Target, Flag, MapPin, AlertCircle, RefreshCw, X } from 'lucide-react';
import './App.css';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterNation, setFilterNation] = useState('');

  // API Base URL - Update this to match your Spring Boot server
  const API_BASE = 'http://localhost:8080/api/v1/player';

  // Fetch players from API
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new player
  const addPlayer = async (playerData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData)
      });
      if (!response.ok) throw new Error('Failed to add player');
      fetchPlayers();
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update player
  const updatePlayer = async (playerData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData)
      });
      if (!response.ok) throw new Error('Failed to update player');
      fetchPlayers();
      setShowEditModal(false);
      setEditingPlayer(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete player
  const deletePlayer = async (playerName) => {
    if (!window.confirm(`Are you sure you want to delete ${playerName}?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/${encodeURIComponent(playerName)}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete player');
      fetchPlayers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter players based on search and filters

    useEffect(() => {
    let filtered = players;

    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTeam) {
      filtered = filtered.filter(player => player.team === filterTeam);
    }

    if (filterPosition) {
      filtered = filtered.filter(player => player.pos === filterPosition);
    }

    if (filterNation) {
      filtered = filtered.filter(player => player.nation === filterNation);
    }

    setFilteredPlayers(filtered);
  }, [players, searchTerm, filterTeam, filterPosition, filterNation]);

  // Get unique values for filters
  const getUniqueValues = (field) => {
    return [...new Set(players.map(player => player[field]).filter(Boolean))].sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTeam('');
    setFilterPosition('');
    setFilterNation('');
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <div className="loading-icon">
            <Trophy className="trophy-icon" />
          </div>
        </div>
        <h3 className="loading-title">Loading Players...</h3>
        <p className="loading-subtitle">Please wait while we fetch the data</p>
      </div>
    </div>
  );

  // Error Display Component
  const ErrorDisplay = () => (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon-wrapper">
          <AlertCircle className="error-icon" />
        </div>
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">{error}</p>
        <p className="error-subtitle">
          Make sure your Spring Boot server is running on http://localhost:8080
        </p>
        <button onClick={fetchPlayers} className="error-retry-btn">
          <RefreshCw className="retry-icon" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );

  // Stats Cards Component
  const StatsCards = () => {
    const stats = [
      {
        title: 'Total Players',
        value: players.length,
        icon: Users,
        color: 'blue-cyan'
      },
      {
        title: 'Teams',
        value: getUniqueValues('team').length,
        icon: Flag,
        color: 'emerald-teal'
      },
      {
        title: 'Nations',
        value: getUniqueValues('nation').length,
        icon: MapPin,
        color: 'purple-pink'
      },
      {
        title: 'Total Goals',
        value: players.reduce((sum, player) => sum + (player.gls || 0), 0).toFixed(1),
        icon: Target,
        color: 'orange-red'
      }
    ];

    return (
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={stat.title} className={`stats-card stats-card-${stat.color}`}>
            <div className="stats-card-content">
              <div className="stats-info">
                <p className="stats-label">{stat.title}</p>
                <p className="stats-value">{stat.value}</p>
              </div>
              <div className={`stats-icon-wrapper stats-icon-${stat.color}`}>
                <stat.icon className="stats-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Filter Section Component
  const FilterSection = () => {
    const hasActiveFilters = searchTerm || filterTeam || filterPosition || filterNation;

    return (
      <div className="filter-section">
        <h3 className="filter-title">
          <Search className="filter-title-icon" />
          Search & Filter Players
        </h3>
        <div className="filter-grid">
          <div className="filter-item">
            <label className="filter-label">Search Players</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="filter-item">
            <label className="filter-label">Filter by Team</label>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="filter-select"
            >
              <option value="">All Teams</option>
              {getUniqueValues('team').map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label className="filter-label">Filter by Position</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="filter-select"
            >
              <option value="">All Positions</option>
              {getUniqueValues('pos').map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label className="filter-label">Filter by Nation</label>
            <select
              value={filterNation}
              onChange={(e) => setFilterNation(e.target.value)}
              className="filter-select"
            >
              <option value="">All Nations</option>
              {getUniqueValues('nation').map(nation => (
                <option key={nation} value={nation}>{nation}</option>
              ))}
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="active-filters">
            <span className="active-filters-text">Active filters applied</span>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    );
  };

  // Players Table Component
  const PlayersTable = () => (
    <div className="players-table-container">
      <div className="players-table-header">
        <h3 className="players-table-title">
          Players ({filteredPlayers.length} of {players.length})
        </h3>
      </div>
      
      {filteredPlayers.length === 0 ? (
        <div className="empty-state">
          <Users className="empty-state-icon" />
          <h3 className="empty-state-title">No players found</h3>
          <p className="empty-state-subtitle">
            {players.length === 0 
              ? "Add your first player to get started" 
              : "Try adjusting your search or filter criteria"
            }
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="players-table">
            <thead className="table-header">
              <tr>
                <th className="table-th">Player</th>
                <th className="table-th">Team</th>
                <th className="table-th">Position</th>
                <th className="table-th">Age</th>
                <th className="table-th">MP</th>
                <th className="table-th">Goals</th>
                <th className="table-th">Assists</th>
                <th className="table-th">xG</th>
                <th className="table-th">xA</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredPlayers.map((player, index) => (
                <tr key={player.name} className="table-row">
                  <td className="table-td">
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div className="player-nation">
                        <Flag className="nation-flag" />
                        {player.nation}
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="team-badge">{player.team}</span>
                  </td>
                  <td className="table-td">
                    <span className="position-badge">{player.pos}</span>
                  </td>
                  <td className="table-td table-data">{player.age}</td>
                  <td className="table-td table-data">{player.mp}</td>
                  <td className="table-td table-data-bold">{player.gls}</td>
                  <td className="table-td table-data-bold">{player.ast}</td>
                  <td className="table-td table-data-muted">{player.xg}</td>
                  <td className="table-td table-data-muted">{player.xag}</td>
                  <td className="table-td">
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setEditingPlayer(player);
                          setShowEditModal(true);
                        }}
                        className="action-btn edit-btn"
                        title="Edit Player"
                      >
                        <Edit className="action-icon" />
                      </button>
                      <button
                        onClick={() => deletePlayer(player.name)}
                        className="action-btn delete-btn"
                        title="Delete Player"
                      >
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Player Modal Component
  const PlayerModal = ({ player, onSubmit, onClose, title }) => {
    const [formData, setFormData] = useState(player || {
      name: '', nation: '', pos: '', age: '', mp: '', starts: '', min: '',
      gls: '', ast: '', pk: '', crdy: '', crdr: '', xg: '', xag: '', team: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const processedData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        mp: formData.mp ? parseInt(formData.mp) : null,
        starts: formData.starts ? parseInt(formData.starts) : null,
        min: formData.min ? parseFloat(formData.min) : null,
        gls: formData.gls ? parseFloat(formData.gls) : null,
        ast: formData.ast ? parseFloat(formData.ast) : null,
        pk: formData.pk ? parseFloat(formData.pk) : null,
        crdy: formData.crdy ? parseFloat(formData.crdy) : null,
        crdr: formData.crdr ? parseFloat(formData.crdr) : null,
        xg: formData.xg ? parseFloat(formData.xg) : null,
        xag: formData.xag ? parseFloat(formData.xag) : null
      };
      onSubmit(processedData);
    };

    const inputFields = [
      { label: 'Name', key: 'name', type: 'text', required: true },
      { label: 'Team', key: 'team', type: 'text' },
      { label: 'Position', key: 'pos', type: 'text' },
      { label: 'Nation', key: 'nation', type: 'text' },
      { label: 'Age', key: 'age', type: 'number' },
      { label: 'Matches Played', key: 'mp', type: 'number' },
      { label: 'Starts', key: 'starts', type: 'number' },
      { label: 'Minutes', key: 'min', type: 'number', step: '0.1' },
      { label: 'Goals', key: 'gls', type: 'number', step: '0.1' },
      { label: 'Assists', key: 'ast', type: 'number', step: '0.1' },
      { label: 'Penalties', key: 'pk', type: 'number', step: '0.1' },
      { label: 'Yellow Cards', key: 'crdy', type: 'number', step: '0.1' },
      { label: 'Red Cards', key: 'crdr', type: 'number', step: '0.1' },
      { label: 'Expected Goals', key: 'xg', type: 'number', step: '0.1' },
      { label: 'Expected Assists', key: 'xag', type: 'number', step: '0.1' }
    ];

    return (
      <div className="modal-backdrop">
        <div className="modal-container">
          <div className="modal-header">
            <div className="modal-header-content">
              <h2 className="modal-title">{title}</h2>
              <button onClick={onClose} className="modal-close-btn">
                <X className="close-icon" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid">
              {inputFields.map((field) => (
                <div key={field.key} className="form-field">
                  <label className="form-label">
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                  </label>
                  <input
                    type={field.type}
                    step={field.step}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    className="form-input"
                    required={field.required}
                  />
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {player ? 'Update' : 'Add'} Player
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon-wrapper">
              <Trophy className="header-icon" />
            </div>
            <div className="header-text">
              <h1 className="header-title">Player Statistics Dashboard</h1>
              <p className="header-subtitle">Manage and analyze player performance</p>
            </div>
          </div>
          <button onClick={() => setShowAddModal(true)} className="add-player-btn">
            <Plus className="add-icon" />
            <span>Add Player</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* Stats Cards */}
        <StatsCards />

        {/* Filter Section */}
        <FilterSection />

        {/* Players Table */}
        <PlayersTable />
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <PlayerModal
          onSubmit={addPlayer}
          onClose={() => setShowAddModal(false)}
          title="Add New Player"
        />
      )}

      {/* Edit Player Modal */}
      {showEditModal && editingPlayer && (
        <PlayerModal
          player={editingPlayer}
          onSubmit={updatePlayer}
          onClose={() => {
            setShowEditModal(false);
            setEditingPlayer(null);
          }}
          title="Edit Player"
        />
      )}
    </div>
  );
};

export default App;
