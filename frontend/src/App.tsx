import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import RegistrationForm from './pages/RegistrationForm'
import SuccessPage from './pages/SuccessPage'

type View = 'landing' | 'signup' | 'login' | 'register' | 'success'

function App() {
  const [currentView, setCurrentView] = useState<View>('landing')
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [, setUserData] = useState<any>(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleGetStarted = () => {
    setCurrentView('register')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSignup = () => {
    setCurrentView('signup')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = () => {
    setCurrentView('login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSignupSuccess = () => {
    // After signup, redirect to login
    setCurrentView('login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoginSuccess = (user: any) => {
    setUserData(user)
    setCurrentView('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRegistrationSuccess = (data: any) => {
    setRegistrationData(data)
    setCurrentView('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setCurrentView('landing')
    setRegistrationData(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Logout function for future use
  // const handleLogout = () => {
  //   localStorage.removeItem('user')
  //   setUserData(null)
  //   setCurrentView('landing')
  //   window.scrollTo({ top: 0, behavior: 'smooth' })
  // }

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && (
        <LandingPage
          onGetStarted={handleGetStarted}
          onSignup={handleSignup}
          onLogin={handleLogin}
        />
      )}
      {currentView === 'signup' && (
        <SignupPage
          onBack={handleBackToLanding}
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={handleLogin}
        />
      )}
      {currentView === 'login' && (
        <LoginPage
          onBack={handleBackToLanding}
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={handleSignup}
        />
      )}
      {currentView === 'register' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="py-8 px-4">
            <button
              onClick={handleBackToLanding}
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        </div>
      )}
      {currentView === 'success' && (
        <SuccessPage data={registrationData} onReset={handleReset} />
      )}
    </div>
  )
}

export default App
