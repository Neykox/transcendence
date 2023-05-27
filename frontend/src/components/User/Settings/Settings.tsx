import React, { useState, ChangeEvent } from 'react';
import './Settings.scss';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';



const Settings = () => {
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    // Effectuer ici les opérations nécessaires pour enregistrer le nouveau pseudo
    setIsModalOpen(false);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
    setProfilePhoto(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div>
      <h1>Paramètres du compte</h1>
  
      <div className="settinglist">
        <div>
          <label htmlFor="username">Modifier son pseudo : </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <button onClick={handleModalOpen}>Modifier</button>
        </div>
  
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Modifier le pseudo</h2>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
              />
              <div className="modal-buttons">
                <button onClick={handleModalSave}>Enregistrer</button>
                <button onClick={handleModalClose}>Annuler</button>
              </div>
            </div>
          </div>
        )}
  
        <div>
         <label htmlFor="darkMode">Activer le dark mode : </label>
        <Toggle
        id="darkMode"
        checked={darkMode}
        onChange={handleDarkModeToggle}
      />
        </div>    
  
        <div>
          <label htmlFor="sound">Activer le son : </label>
          <Toggle
            id="sound"
            checked={soundEnabled}
            onChange={handleSoundToggle}
          />
        </div>
  
        <div>
          <label htmlFor="profilePhoto">Modifier sa photo de profil : </label>
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </div>
  
        {profilePhoto && (
          <div>
            <h3>Photo de profil actuelle : </h3>
            <img src={profilePhoto} alt="Profile" /> 
          </div>
        )}
  
        <button>Enregistrer</button>
      </div>
    </div>
  );
};

export default Settings;
