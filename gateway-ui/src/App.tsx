import HomePage from './pages/HomePage'
import './App.css'
import { ThemeProvider } from './contexts/themeContext'

function App() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  )
}

export default App
