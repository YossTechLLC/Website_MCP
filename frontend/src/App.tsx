import { useState } from 'react'
import RegistrationForm from './pages/RegistrationForm'
import SuccessPage from './pages/SuccessPage'

function App() {
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registrationData, setRegistrationData] = useState<any>(null)

  const handleRegistrationSuccess = (data: any) => {
    setRegistrationData(data)
    setRegistrationComplete(true)
  }

  const handleReset = () => {
    setRegistrationComplete(false)
    setRegistrationData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {!registrationComplete ? (
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      ) : (
        <SuccessPage data={registrationData} onReset={handleReset} />
      )}
    </div>
  )
}

export default App
