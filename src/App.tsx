import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/header/Index.tsx'
import { Body } from './components/body/Index.tsx'
import { Footer } from './components/footer/Index.tsx';
import { AuthProvider } from './Auth/AuthProvider.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <Body />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
