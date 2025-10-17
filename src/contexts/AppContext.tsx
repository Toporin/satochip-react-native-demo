import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface AppContextInterface {
  cvc: string;
  setCvc: Dispatch<SetStateAction<string>>;
  pin: string;
  setPin: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext<AppContextInterface>({
  cvc: '',
  setCvc: state => {},
  pin: '',
  setPin: state => {},
});

function AppProvider({ children }: { children: React.ReactNode }) {
  const [cvc, setCvc] = useState<string>('');
  const [pin, setPin] = useState<string>('');

  return (
    <AppContext.Provider
      value={{
        cvc,
        setCvc,
        pin,
        setPin,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
