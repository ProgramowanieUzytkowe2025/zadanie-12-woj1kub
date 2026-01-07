import './App.css'
import { AppCalculator } from './AppCalculator'
import { AppHeader } from './AppHeader'
import { FontProvider, useFont } from './FontProvider';

function AppContent() {
  const { font } = useFont();

  return (
    <div className="app" style={{ fontSize: font }}>
      <div>
        <AppHeader imie={'Imię'} nazwisko={'Nazwisko'} />
      </div>
      <div>
        <AppCalculator />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <FontProvider>
      <AppContent />
    </FontProvider>
  )
}
