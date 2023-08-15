export interface UserInfo {
    id: string;
    avatar: string;
    pseudo: string;
    login: string;
    image: string;
    first_name: string;
    last_name: string;
  }
  
  export const initialUser: UserInfo = {
    id: 'a',
    avatar: 'a',
    pseudo: 'a',
    login: 'a',
    image: 'a',
    first_name: 'a',
    last_name: 'a',
  };

  //export interface UserContextProps {
  //  user: UserInfo | undefined;
  //  setUser: (userInfo: UserInfo | undefined) => void;
  //}