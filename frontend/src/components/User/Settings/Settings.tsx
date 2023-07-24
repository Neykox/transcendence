import React, { useState, ChangeEvent, useContext, useEffect } from 'react';
import './Settings.scss';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
//import { user } from '../Profile/PlayerInfo/PlayerInfo';
import NavBar from '../../NavBar/NavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import test from '../../../asset/images/test.jpg'; // a supprimer juste pour tester
import arcencielfille from '../../../asset/images/arcencielfille.jpg';
import arcencielgarcon from '../../../asset/images/arcencielgarcon.jpg';
import chat from '../../../asset/images/chat.jpg';
import fille from '../../../asset/images/fille.jpg';
import lunette from '../../../asset/images/lunette.jpg';
import lunette2 from '../../../asset/images/lunette2.jpg';
import lunettesoleil from '../../../asset/images/lunettesoleil.jpg';
import peinture from '../../../asset/images/peinture.jpg';
import smiley from '../../../asset/images/smiley.jpg';
import vert from '../../../asset/images/vert.jpg';
import UserContext from '../../../model/userContext';
import { UserInfo } from '../../../model/userInfo';

import { useNavigate } from 'react-router-dom';




const Settings = () => {
  let { user, setUser } = useContext<UserInfo>(UserContext);
  // const userContext = useContext(UserContext);
  //const [username, setUsername] = useState(user.username);
  const [pseudo, setPseudo] = useState(user.pseudo);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);
  const [selectedDefaultAvatar, setSelectedDefaultAvatar] = useState("");
  const [doubleAuthEnabled, setDoubleAuthEnabled] = useState(false);
  //const [userId, setUserId] = useState(user.id);
  const navigate = useNavigate();

  /*
  evenements de changement de nom d'utilisateur
  */
  const handlePseudoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPseudo(event.target.value);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  //const handleModalSave = () => {
  //  user.login = login; 
  //  setIsModalOpen(false);
  //};

  const handleModalSave = () => {
    setUser(prevUser => ({ ...prevUser, pseudo }));
    fetch(`http://localhost:5000/users/changePseudo`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Pseudo: pseudo }),
    })
      .then(response => {
        if (response.ok) {
          toast.success('Pseudo mis à jour avec succès');
        } else {
          toast.error('Une erreur est survenue lors de la mise à jour du pseudo');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du pseudo', error);
        toast.error('Une erreur est survenue lors de la mise à jour du pseudo');
      });
  
    setIsModalOpen(false);
  };

  /*
  evenements de changement de mode 
  */

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  /*
  evenements de changement de son
  */

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  /* 
  evenements de changement de double authentification
  */

  const doubleAuthhandleSoundToggle = async (e) => {
    setDoubleAuthEnabled(e.target.checked);
    if (e.target.checked === false)
    {
      const turnOff = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          };

        await fetch('http://localhost:5000/two_fa/turn-off', requestOptions);
      };
      user = {...user, is2FaActive: false};
      localStorage.setItem("user", await JSON.stringify(user));
      await turnOff();
    }
    else
      navigate("/twofa");
  };

  /*
  evenements de changement de photo de profil
  */ 

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const newAvatarUrl = URL.createObjectURL(file);
      setProfilePhoto(newAvatarUrl);
    }
  };

  const handleSave = () => {

    if (profilePhoto) 
       user.image = profilePhoto;
    else if (selectedDefaultAvatar) 
      user.image = selectedDefaultAvatar;
    
     setUser(prevUser => ({ ...prevUser, Image }));
     fetch(`http://localhost:5000/users/changeAvatar`, {
     method: 'PUT',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ Image: user.image }),
      })
     .then(response => {
       if (response.ok) {
         toast.success('Avatar mis à jour avec succès');
       } else {
         toast.error('Une erreur est survenue lors de la mise à jour de l\'avatar');
       }
     })
     .catch(error => {
       console.error('Erreur lors de la mise à jour du l\'avatar', error);
       toast.error('Une erreur est survenue lors de la mise à jour du l\'avatar');
     });

    //if (profilePhoto) {
    //  user.avatar = profilePhoto;
    //  toast.success('Photo de profil enregistrée avec succès');
    //} else if (selectedDefaultAvatar) {
    //  user.avatar = selectedDefaultAvatar;
    //  toast.success('Avatar par défaut enregistré avec succès');
    //}
  };
  var image42:string = localStorage.getItem('42image') as string;

   useEffect(() => {
    // const test = () => {
    //   console.log(user.is2FaActive)
    //   userContext.setUser(prevUser => ({ ...prevUser, is2FaActive: !is2FaActive }));
    // };
    // test();
    setDoubleAuthEnabled(user.is2FaActive);
  }, [user]);

  return (

     
    <div>
     <NavBar />
      <div className="settinglist">
      <div>
      <label htmlFor="login">Modifier son pseudo: </label>
      <button onClick={handleModalOpen}>Modifier</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le pseudo</h2>
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={handlePseudoChange}
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
          <label htmlFor="2fa">Activer l'authentification à deux facteurs : </label>
          <Toggle
            id="2fa"
            checked={doubleAuthEnabled}
            onChange={doubleAuthhandleSoundToggle}
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
          <h3>Ancienne photo de profil : </h3>
          <img className="imglist" src={user.image} alt="Avatar" />
          <h3>Nouvelle photo de profil : </h3>
          <img className="imglist" src={profilePhoto} alt="Avatar" />
          <button onClick={handleSave}>Enregistrer</button>
        </div>
      )}
        <button onClick={() => setIsModal2Open(false)}>Fermer</button>
      </Modal>

      <Modal isOpen={isDefaultModalOpen}>
        <h2>Choisir un avatar par défaut</h2>
        <div>   
		{image42 !== 'null' && ( 
            <img className={selectedDefaultAvatar === image42 ? "selectedImage imglist" : "imglist"} src={image42} alt="Avatar" onClick={() => setSelectedDefaultAvatar(() => image42)} />
          )}
		  <img className={selectedDefaultAvatar === test ? "selectedImage imglist" : "imglist"} src={test}  alt="Avatar4" onClick={() => setSelectedDefaultAvatar(() => test)} />
          <img className={selectedDefaultAvatar === arcencielfille ? "selectedImage imglist" : "imglist"} src={arcencielfille}  alt="Avatar1" onClick={() => setSelectedDefaultAvatar(() => arcencielfille)} />
          <img className={selectedDefaultAvatar === chat ? "selectedImage imglist" : "imglist"} src={chat}  alt="Avatar2" onClick={() => setSelectedDefaultAvatar(() => chat)} />
          <img className={selectedDefaultAvatar === fille ? "selectedImage imglist" : "imglist"} src={fille}  alt="Avatar3" onClick={() => setSelectedDefaultAvatar(() => fille)} />
          <img className={selectedDefaultAvatar === lunette2 ? "selectedImage imglist" : "imglist"} src={lunette2}  alt="Avatar5" onClick={() => setSelectedDefaultAvatar(() => lunette2)} />
          <img className={selectedDefaultAvatar === lunette ? "selectedImage imglist" : "imglist"} src={lunette}  alt="Avatar6" onClick={() => setSelectedDefaultAvatar(() => lunette)} />
          <img className={selectedDefaultAvatar === lunettesoleil ? "selectedImage imglist" : "imglist"} src={lunettesoleil} alt="Avatar7" onClick={() => setSelectedDefaultAvatar(() => lunettesoleil)} />
          <img className={selectedDefaultAvatar === peinture ? "selectedImage imglist" : "imglist"} src={peinture}  alt="Avatar8" onClick={() => setSelectedDefaultAvatar(() => peinture)} />
          <img className={selectedDefaultAvatar === smiley ? "selectedImage imglist" : "imglist"} src={smiley}  alt="Avatar9" onClick={() => setSelectedDefaultAvatar(() => smiley)} />
          <img className={selectedDefaultAvatar === vert ? "selectedImage imglist" : "imglist"} src={vert}  alt="Avatar10" onClick={() => setSelectedDefaultAvatar(() => vert)} />
          <img className={selectedDefaultAvatar === arcencielgarcon ? "selectedImage imglist" : "imglist"} src={arcencielgarcon}  alt="Avatar11" onClick={() => setSelectedDefaultAvatar(() => arcencielgarcon)} /> master
        </div>
        {selectedDefaultAvatar && (
          <button onClick={handleSave}>Enregistrer</button>
        )}
        <button onClick={() => setIsDefaultModalOpen(false)}>Fermer</button>
      </Modal>
  

      </div>
    </div>
  );
};

export default Settings;
