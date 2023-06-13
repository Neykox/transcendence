import React, { createContext, useState } from 'react';
import { UserInfo, initialUser } from './userInfo';
//import { UserInfo, UserContextProps } from './userInfo';

interface UserContextProps {
  user: UserInfo;
  setUser: (userInfo: UserInfo) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: initialUser,
  setUser: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserInfo>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

//export default UserContext;

//export const UserContext = createContext<UserContextProps | undefined>(undefined);

//export const UserProvider: React.FC = ({ children }) => {
//  const [user, setUser] = useState<UserInfo | undefined>();

//  const userContextValue: UserContextProps = {
//    user,
//    setUser,
//  };

//  return (
//    <UserContext.Provider value={userContextValue}>
//      {children}
//    </UserContext.Provider>
//  );
//};

export default UserContext