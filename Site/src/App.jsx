import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Index from './pages/Index'
import Menu from './pages/Menu'
import Profile from './pages/Profile'
import Reviews from './pages/Reviews'
import Contacts from './pages/Contacts'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}> 
            <Route index element={<Index />}/>
            <Route path="menu" element={<Menu />}/>
            <Route path="profile" element={<Profile />}/>
            <Route path="reviews" element={<Reviews />}/>
            <Route path="contacts" element={<Contacts />}/>
          </Route>
          <Route path="*" element={<NotFound />}/>
        </Routes>                                                                          
      </Router>
    </AuthProvider>
  )
}

export default App;
