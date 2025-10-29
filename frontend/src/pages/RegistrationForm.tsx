import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/client'
import type { ChannelRegistrationData, RegistrationResponse } from '../types'

// Validation schema with Zod
const registrationSchema = z.object({
  open_channel_id: z.string()
    .min(1, 'Open Channel ID is required')
    .regex(/^-/, 'Channel ID must start with "-"')
    .max(50, 'Channel ID too long'),
  open_channel_title: z.string()
    .min(1, 'Channel title is required')
    .max(100, 'Title too long'),
  open_channel_description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  closed_channel_id: z.string()
    .min(1, 'Closed Channel ID is required')
    .regex(/^-/, 'Channel ID must start with "-"')
    .max(50, 'Channel ID too long'),
  closed_channel_title: z.string()
    .min(1, 'Channel title is required')
    .max(100, 'Title too long'),
  closed_channel_description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  tierCount: z.enum(['1', '2', '3']),
  sub_1_price: z.number().min(0.01).optional(),
  sub_1_time: z.number().min(1).optional(),
  sub_2_price: z.number().min(0.01).optional(),
  sub_2_time: z.number().min(1).optional(),
  sub_3_price: z.number().min(0.01).optional(),
  sub_3_time: z.number().min(1).optional(),
  client_payout_network: z.string().min(1, 'Network is required'),
  client_payout_currency: z.string().min(1, 'Currency is required'),
  client_wallet_address: z.string()
    .min(1, 'Wallet address is required')
    .max(110, 'Wallet address too long'),
}).refine((data) => {
  // Validate tier 1 is always present
  if (data.tierCount === '1' && (!data.sub_1_price || !data.sub_1_time)) {
    return false
  }
  // Validate tier 2 if selected
  if (['2', '3'].includes(data.tierCount) && (!data.sub_2_price || !data.sub_2_time)) {
    return false
  }
  // Validate tier 3 if selected
  if (data.tierCount === '3' && (!data.sub_3_price || !data.sub_3_time)) {
    return false
  }
  return true
}, { message: 'All selected tiers must have price and time values' })

type FormData = z.infer<typeof registrationSchema>

interface Props {
  onSuccess: (data: RegistrationResponse) => void
}

const RegistrationForm = ({ onSuccess }: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [tierCount, setTierCount] = useState<'1' | '2' | '3'>('1')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([])

  // Fetch network-currency mappings
  const { data: mappings, isLoading: mappingsLoading } = useQuery({
    queryKey: ['network-currency-mappings'],
    queryFn: api.getNetworkCurrencyMappings,
  })

  // Get unique networks from mappings
  const networks = mappings
    ? Array.from(new Set(mappings.map(m => m.network_code)))
        .map(code => {
          const mapping = mappings.find(m => m.network_code === code)
          return { code, name: mapping?.network_name || code }
        })
    : []

  // Update available currencies when network changes
  useEffect(() => {
    if (mappings && selectedNetwork) {
      const currencies = mappings
        .filter(m => m.network_code === selectedNetwork)
        .map(m => m.currency_code)
      setAvailableCurrencies(currencies)
    } else {
      setAvailableCurrencies([])
    }
  }, [selectedNetwork, mappings])

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      tierCount: '1',
    },
  })

  // Watch tier count changes
  useEffect(() => {
    setValue('tierCount', tierCount)
  }, [tierCount, setValue])

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: async (data: ChannelRegistrationData) => {
      return api.registerChannel(data)
    },
    onSuccess: (data) => {
      toast.success('Channel registered successfully!')
      onSuccess(data)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.')
    },
  })

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not ready. Please wait and try again.')
      return
    }

    try {
      // Execute reCAPTCHA
      const captcha_token = await executeRecaptcha('register')

      // Prepare registration data
      const registrationData: ChannelRegistrationData = {
        open_channel_id: data.open_channel_id,
        open_channel_title: data.open_channel_title,
        open_channel_description: data.open_channel_description,
        closed_channel_id: data.closed_channel_id,
        closed_channel_title: data.closed_channel_title,
        closed_channel_description: data.closed_channel_description,
        sub_1_price: data.sub_1_price,
        sub_1_time: data.sub_1_time,
        sub_2_price: data.sub_2_price,
        sub_2_time: data.sub_2_time,
        sub_3_price: data.sub_3_price,
        sub_3_time: data.sub_3_time,
        client_wallet_address: data.client_wallet_address,
        client_payout_currency: data.client_payout_currency,
        client_payout_network: data.client_payout_network,
        captcha_token,
      }

      // Submit registration
      await registrationMutation.mutateAsync(registrationData)
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PayGate Prime
          </h1>
          <p className="text-lg text-gray-600">
            Register your Telegram channel for premium subscriptions
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Open Channel Section */}
          <div className="form-section">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Open Channel Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="open_channel_id" className="block text-sm font-medium text-gray-700">
                  Channel ID *
                </label>
                <input
                  type="text"
                  id="open_channel_id"
                  placeholder="-1001234567890"
                  className="input-field"
                  {...register('open_channel_id')}
                />
                {errors.open_channel_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.open_channel_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="open_channel_title" className="block text-sm font-medium text-gray-700">
                  Channel Title *
                </label>
                <input
                  type="text"
                  id="open_channel_title"
                  placeholder="My Awesome Channel"
                  className="input-field"
                  {...register('open_channel_title')}
                />
                {errors.open_channel_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.open_channel_title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="open_channel_description" className="block text-sm font-medium text-gray-700">
                  Channel Description *
                </label>
                <textarea
                  id="open_channel_description"
                  rows={3}
                  placeholder="Describe your open channel..."
                  className="input-field"
                  {...register('open_channel_description')}
                />
                {errors.open_channel_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.open_channel_description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Closed Channel Section */}
          <div className="form-section">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Closed Channel Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="closed_channel_id" className="block text-sm font-medium text-gray-700">
                  Channel ID *
                </label>
                <input
                  type="text"
                  id="closed_channel_id"
                  placeholder="-1001234567891"
                  className="input-field"
                  {...register('closed_channel_id')}
                />
                {errors.closed_channel_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.closed_channel_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="closed_channel_title" className="block text-sm font-medium text-gray-700">
                  Channel Title *
                </label>
                <input
                  type="text"
                  id="closed_channel_title"
                  placeholder="My Premium Channel"
                  className="input-field"
                  {...register('closed_channel_title')}
                />
                {errors.closed_channel_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.closed_channel_title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="closed_channel_description" className="block text-sm font-medium text-gray-700">
                  Channel Description *
                </label>
                <textarea
                  id="closed_channel_description"
                  rows={3}
                  placeholder="Describe your closed/premium channel..."
                  className="input-field"
                  {...register('closed_channel_description')}
                />
                {errors.closed_channel_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.closed_channel_description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Tiers Section */}
          <div className="form-section">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Subscription Tiers
            </h2>

            {/* Tier Count Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How many tiers do you want to offer? *
              </label>
              <div className="flex gap-4">
                {(['1', '2', '3'] as const).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTierCount(count)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      tierCount === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count} Tier{count !== '1' ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier 1 */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">Tier 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sub_1_price" className="block text-sm font-medium text-gray-700">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="sub_1_price"
                    placeholder="9.99"
                    className="input-field"
                    {...register('sub_1_price', { valueAsNumber: true })}
                  />
                  {errors.sub_1_price && (
                    <p className="mt-1 text-sm text-red-600">{errors.sub_1_price.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="sub_1_time" className="block text-sm font-medium text-gray-700">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    id="sub_1_time"
                    placeholder="30"
                    className="input-field"
                    {...register('sub_1_time', { valueAsNumber: true })}
                  />
                  {errors.sub_1_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.sub_1_time.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            {['2', '3'].includes(tierCount) && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Tier 2</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sub_2_price" className="block text-sm font-medium text-gray-700">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="sub_2_price"
                      placeholder="24.99"
                      className="input-field"
                      {...register('sub_2_price', { valueAsNumber: true })}
                    />
                    {errors.sub_2_price && (
                      <p className="mt-1 text-sm text-red-600">{errors.sub_2_price.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sub_2_time" className="block text-sm font-medium text-gray-700">
                      Duration (days) *
                    </label>
                    <input
                      type="number"
                      id="sub_2_time"
                      placeholder="90"
                      className="input-field"
                      {...register('sub_2_time', { valueAsNumber: true })}
                    />
                    {errors.sub_2_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.sub_2_time.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tier 3 */}
            {tierCount === '3' && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Tier 3</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sub_3_price" className="block text-sm font-medium text-gray-700">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="sub_3_price"
                      placeholder="49.99"
                      className="input-field"
                      {...register('sub_3_price', { valueAsNumber: true })}
                    />
                    {errors.sub_3_price && (
                      <p className="mt-1 text-sm text-red-600">{errors.sub_3_price.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sub_3_time" className="block text-sm font-medium text-gray-700">
                      Duration (days) *
                    </label>
                    <input
                      type="number"
                      id="sub_3_time"
                      placeholder="365"
                      className="input-field"
                      {...register('sub_3_time', { valueAsNumber: true })}
                    />
                    {errors.sub_3_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.sub_3_time.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Information Section */}
          <div className="form-section">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Payment Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="client_payout_network" className="block text-sm font-medium text-gray-700">
                  Payout Network *
                </label>
                <select
                  id="client_payout_network"
                  className="input-field"
                  disabled={mappingsLoading}
                  {...register('client_payout_network')}
                  onChange={(e) => {
                    setSelectedNetwork(e.target.value)
                    setValue('client_payout_network', e.target.value)
                    setValue('client_payout_currency', '') // Reset currency when network changes
                  }}
                >
                  <option value="">Select a network...</option>
                  {networks.map(network => (
                    <option key={network.code} value={network.code}>
                      {network.name} ({network.code})
                    </option>
                  ))}
                </select>
                {errors.client_payout_network && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_payout_network.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="client_payout_currency" className="block text-sm font-medium text-gray-700">
                  Payout Currency *
                </label>
                <select
                  id="client_payout_currency"
                  className="input-field"
                  disabled={!selectedNetwork || availableCurrencies.length === 0}
                  {...register('client_payout_currency')}
                >
                  <option value="">
                    {!selectedNetwork ? 'Select a network first...' : 'Select a currency...'}
                  </option>
                  {availableCurrencies.map(currency => {
                    const mapping = mappings?.find(
                      m => m.network_code === selectedNetwork && m.currency_code === currency
                    )
                    return (
                      <option key={currency} value={currency}>
                        {mapping?.currency_name || currency} ({currency})
                      </option>
                    )
                  })}
                </select>
                {errors.client_payout_currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_payout_currency.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="client_wallet_address" className="block text-sm font-medium text-gray-700">
                  Wallet Address *
                </label>
                <input
                  type="text"
                  id="client_wallet_address"
                  placeholder="Enter your wallet address"
                  className="input-field font-mono text-sm"
                  {...register('client_wallet_address')}
                />
                {errors.client_wallet_address && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_wallet_address.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Ensure your wallet address is correct. Payments cannot be reversed.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || registrationMutation.isPending}
              className="btn-primary"
            >
              {isSubmitting || registrationMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register Channel'
              )}
            </button>
          </div>

          {/* reCAPTCHA Notice */}
          <p className="text-center text-xs text-gray-500">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            apply.
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
