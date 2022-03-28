import React, { useMemo, useReducer, useState } from "react";
import { useSafeContext } from "react-safe-context-hooks";
import {
  useBootstrap,
  useLogin,
  useLogout,
  useBiometry,
  AuthConfig,
} from "./internal";

interface AuthContextValue {
  isLoading: boolean;
  isLoggedIn: boolean;
  login: ReturnType<typeof useLogin>;
  logout: () => void;
  isBiometryEnabled: boolean | null;
  setBiometryStatus: (status: boolean) => void;
  isBiometryAvailable: boolean | null;
  result: any;
  loginError: string | boolean;
}

export const AuthContext = React.createContext<AuthContextValue | null>(null);

AuthContext.displayName = "AuthContext";

export const useAuth = () => useSafeContext(AuthContext);

// eslint-disable-next-line react/display-name
export const withAuth = <P,>(WrappedComponent: React.ComponentType<P>) => (
  props: P
) => {
  const auth = useAuth();

  return <WrappedComponent auth={auth} {...(props as P)} />;
};

enum AuthAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  RESTORE_TOKEN = "RESTORE_TOKEN",
}

interface State {
  isLoading: boolean;
  // TODO? isLoggedIn: boolean;
  accessToken: string | null;
  // TODO? refreshToken: string;
}

interface LoginAction {
  type: AuthAction.LOGIN;
  payload: string;
}

interface LogoutAction {
  type: AuthAction.LOGOUT;
}

interface RestoreTokenAction {
  type: AuthAction.RESTORE_TOKEN;
  payload: string;
}

type Action = LoginAction | LogoutAction | RestoreTokenAction;

const initialState: State = {
  isLoading: true,
  accessToken: null,
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case AuthAction.LOGIN:
      return {
        ...state,
        accessToken: action.payload,
      };

    case AuthAction.LOGOUT:
      return {
        ...state,
        accessToken: null,
      };

    case AuthAction.RESTORE_TOKEN:
      return {
        ...state,
        isLoading: false,
        accessToken: action.payload,
      };

    default:
      return state;
  }
};

interface AuthProviderProps {
  children?: React.ReactNode;
  config: AuthConfig;
  // enableBiometry?: boolean;
}

export const AuthProvider = ({ children, config }: AuthProviderProps) => {
  const {
    authenticate,
    // facialRecognitionAvailable,
    // fingerprintAvailable,
    // irisAvailable,
    isBiometryEnabled,
    setBiometryStatus,
    isEnrolledDevice,
    result,
  } = useBiometry();

  const [state, dispatch] = useReducer(reducer, initialState);

  const { issuer, ...restConfig } = config;

  const [loginError, setLoginError] = useState<boolean | string>("");

  const login = useLogin({
    issuer,
    config: restConfig,
    onSuccess: (accessToken) => {
      dispatch({ type: AuthAction.LOGIN, payload: accessToken });

      setLoginError("");
    },
    onError: () => setLoginError(true),
  });

  const logout = useLogout({
    issuer,
    onSuccess: () => dispatch({ type: AuthAction.LOGOUT }),
    onError: (err) => console.error(err),
  });

  useBootstrap({
    authenticate,
    isBiometryEnabled,
    isEnrolledDevice,
    onSuccess: (accessToken) =>
      dispatch({ type: AuthAction.RESTORE_TOKEN, payload: accessToken }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onError: () => dispatch({ type: AuthAction.RESTORE_TOKEN, payload: null }),
  });

  const contextValue = useMemo(
    () => ({
      ...state,
      isLoggedIn: !!state.accessToken,
      login,
      logout,
      isBiometryEnabled,
      setBiometryStatus,
      isBiometryAvailable: isEnrolledDevice,
      result,
      loginError,

      // isBiometryEnabled,
      // isBiometryAvailable,
      // isEnrolledDevice,
    }),
    [
      state,
      login,
      logout,
      isBiometryEnabled,
      setBiometryStatus,
      isEnrolledDevice,
      result,
      loginError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
