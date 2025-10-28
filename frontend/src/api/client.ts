/**
 * API Client for PayGate Prime Backend
 */
import axios, { AxiosError } from 'axios'
import type {
  ChannelRegistrationData,
  NetworkCurrencyMapping,
  RegistrationResponse,
  ApiError,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error
      const detail = error.response.data?.detail
      if (typeof detail === 'string') {
        throw new Error(detail)
      } else if (Array.isArray(detail)) {
        const messages = detail.map((err) => err.msg).join(', ')
        throw new Error(messages)
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.')
    }
    throw error
  }
)

/**
 * API Methods
 */
export const api = {
  /**
   * Register a new channel
   */
  registerChannel: async (
    data: ChannelRegistrationData
  ): Promise<RegistrationResponse> => {
    const response = await apiClient.post<RegistrationResponse>(
      '/api/v1/register/',
      data
    )
    return response.data
  },

  /**
   * Get network-currency mappings
   */
  getNetworkCurrencyMappings: async (): Promise<NetworkCurrencyMapping[]> => {
    const response = await apiClient.get<NetworkCurrencyMapping[]>(
      '/api/v1/networks/mappings'
    )
    return response.data
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/api/v1/health')
    return response.data
  },
}

export default api
