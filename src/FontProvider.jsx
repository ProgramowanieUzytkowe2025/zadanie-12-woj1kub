import React, { createContext, useContext, useState } from 'react';

const FontContext = createContext();

export function FontProvider({ children }) {
  const [font, setFont] = useState('small');

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
