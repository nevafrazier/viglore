import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Cities from './pages/Cities'
import Stocks from './pages/Stocks'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/stocks" element={<Stocks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
