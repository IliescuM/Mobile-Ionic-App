import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { login as loginApi } from './authApi';
import {Storage} from "@capacitor/storage";
import {ConnectionStatus, Network} from "@capacitor/network";

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login?: LoginFn;
  logout?: () => void;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: string;
  networkStatus?: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token, networkStatus } = state;

  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<() => void>(logoutCallback, []);

  useEffect(authenticationEffect, [pendingAuthentication]);
  useEffect(() => {
    function networkStatusChangedListener(status: ConnectionStatus){
      log("status changed");
      setState({...state, networkStatus:status.connected});
    }

    log("useEffect")
    Network.addListener('networkStatusChange',
        networkStatusChangedListener);

    Network.getStatus().then(networkStatusChangedListener);
  }, [networkStatus]);

  //get the user from local storage, if it exists
  if(!isAuthenticated)
    getUserFromLocalStorage();

  const value = { isAuthenticated, login, logout, isAuthenticating, authenticationError, token, networkStatus };
  log('render');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  function loginCallback(username?: string, password?: string): void {
    log('loginCallback');
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password
    });
  }

  function logoutCallback(): void {
    log('logoutCallback');
    setState({
      ...state,
      isAuthenticated: false,
      username: undefined,
      password: undefined,
      token: ""
    });

    (async () => {
      log("remove user from local storage");
      await Storage.clear();
    })();
  }

  function authenticationEffect() {
    log("authenticationEffect");
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    }

    async function authenticate() {
      if (!pendingAuthentication) {
        log('authenticate, !pendingAuthentication, return');
        return;
      }
      try {
        log('authenticate, pendingAuthentication true.');
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        if(!username || !password) {
          log("authentication failed. Empty username or password");
          return;
        }

        const { token } = await loginApi(username, password);
        if (canceled) {
          return;
        }
        log('authenticate succeeded');
        setState({
          ...state,
          token,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });

        // save user in storage
        saveUserToLocalStorage(username, password, token);

      } catch (error) {
        if (canceled) {
          return;
        }
        log('authenticate failed');
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }

  function saveUserToLocalStorage(username: string, password: string, token: string) {
    (async () => {
      log("save user to local storage");


      // Saving ({ key: string, value: string }) => Promise<void>
      await Storage.set({
        key: 'user',
        value: JSON.stringify({
          username, password, token,
        })
      });
    })();
  }

  function getUserFromLocalStorage() {
    if(!isAuthenticated)
      (async () => {
      log("get user from local storage");

      const res = await Storage.get({ key: 'user' });
      if (res && res.value) {
        const user = JSON.parse(res.value);
        log('User found');
        setState({...state,
          isAuthenticated: true,
          username: user.username,
          password: user.password,
          token: user.token });
      } else {
        log('User not found');
      }
    })();
  }

};
