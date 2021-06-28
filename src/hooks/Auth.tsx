import React , { createContext, useCallback, useContext, useState } from 'react';
import AsyncStorage  from '@react-native-community/async-storage';
import api from '../services/api'
import { useEffect } from 'react';


interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: object;
    loading: boolean;
    SignIn(credentials: SignInCredentials ): Promise<void>;
    SignOut(): void;
    
}

interface AuthState {
  token: string;
  user:  object;
}

 const AuthContext = createContext<AuthContextData>( {} as AuthContextData);

 const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
     async function loadStorageData(): Promise<void> {
         const [user, token] = await AsyncStorage.multiGet([
             '@GoBarber:user',
             '@GoBarber:token'
         ]);
         
         if(token[1] && user[1]) {
             setData({token: token[1], user: JSON.parse(user[1])});
         }

       setLoading(false);
     }

     loadStorageData();

    }, []);

    const SignIn = useCallback( async({email, password}) => {
        const response = await api.post('sessions', {
         email,
         password   
        });

        const { token, user } = response.data;
      await  AsyncStorage.setItem('@GoBarber:token', token);
      await  AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      await AsyncStorage.multiSet([
          ['@GoBarber:token', token], 
          ['@GoBarber:user', JSON.stringify(user)]        
        ]);

        setData({token, user})
     }, []);

    const SignOut = useCallback(async () => {
        await  AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
       
        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, loading, SignIn, SignOut}}>
        {children}
        </AuthContext.Provider>
    );
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must bem used within a AuthProvider');
    }

    return context;
}


export {AuthProvider, useAuth};


