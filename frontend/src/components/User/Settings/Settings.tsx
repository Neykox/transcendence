import React, { useState, ChangeEvent } from 'react';
import './Settings.scss';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { user } from '../Profile/PlayerInfo/PlayerInfo';
import NavBar from '../../NavBar/NavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const Settings = () => {
  const [username, setUsername] = useState(user.username);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);

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
    user.username = username; 
    setIsModalOpen(false);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const newAvatarUrl = URL.createObjectURL(file);
      setProfilePhoto(newAvatarUrl);
    }
  };

  const handleSave = () => {
    user.avatar = profilePhoto;
    toast.success('Photo de profil enregistrée avec succès');
  };
  

  return (

     
    <div>
     <NavBar />
      <div className="settinglist">
      <div>
      <label htmlFor="username">Modifier son pseudo: </label>
      <button onClick={handleModalOpen}>Modifier</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le pseudo</h2>
            <input
              type="text"
              id="username"
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
    </div>
  
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

        <button onClick={() => setIsModal2Open(true)}>Avatar perso</button>
        <button onClick={() => setIsDefaultModalOpen(true)}>Avatar par défaut</button>
      </div>



      <Modal isOpen={isModal2Open}>
        <h2>Choisir une photo de profil</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePhotoChange}
        />
              {profilePhoto && (
        <div>
          <h3>Ancienne photo de profil :</h3>
          <img src={user.avatar} alt="Avatar" />
          <h3>Nouvelle photo de profil :</h3>
          <img src={profilePhoto} alt="Avatar" />
          <button onClick={handleSave}>Enregistrer</button>
        </div>
      )}
        <button onClick={() => setIsModal2Open(false)}>Fermer</button>
      </Modal>

      <Modal isOpen={isDefaultModalOpen}>
        <h2>Choisir un avatar par défaut</h2>
        <div>
          <img src="chemin/vers/image1.jpg" alt="Avatar 1" />
          <img src="chemin/vers/image2.jpg" alt="Avatar 2" />
          <img src="chemin/vers/image3.jpg" alt="Avatar 3" />
        </div>
        <button onClick={() => setIsDefaultModalOpen(false)}>Fermer</button>
      </Modal>
  

      </div>
    </div>
  );
};

export default Settings;
