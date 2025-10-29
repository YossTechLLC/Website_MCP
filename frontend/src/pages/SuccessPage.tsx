import { motion } from 'framer-motion'
import { CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { RegistrationResponse } from '../types'

interface Props {
  data: RegistrationResponse
  onReset: () => void
}

const SuccessPage = ({ data, onReset }: Props) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-2xl">
            <CheckCircleIcon className="w-16 h-16 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
          >
            Registration Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600"
          >
            Your channel has been registered with PayGate Prime
          </motion.p>
        </motion.div>

        {/* Registration Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Registration Details
          </h2>

          <div className="space-y-4">
            {/* Registration ID */}
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Registration ID</p>
              <p className="text-lg font-semibold text-gray-900">#{data.id}</p>
            </div>

            {/* Open Channel */}
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Open Channel</p>
              <p className="text-lg font-semibold text-gray-900">{data.open_channel_title}</p>
              <p className="text-sm text-gray-600 font-mono">{data.open_channel_id}</p>
            </div>

            {/* Closed Channel */}
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Closed Channel</p>
              <p className="text-lg font-semibold text-gray-900">{data.closed_channel_title}</p>
              <p className="text-sm text-gray-600 font-mono">{data.closed_channel_id}</p>
            </div>

            {/* Status */}
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    data.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {data.is_active ? 'Active' : 'Inactive'}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    data.verified
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {data.verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>

            {/* Registration Date */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Registered On</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(data.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
            What's Next?
          </h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 flex-shrink-0">
                1
              </span>
              <span>
                <strong>Verification:</strong> Our team will review your registration and verify your channels within 24-48 hours.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 flex-shrink-0">
                2
              </span>
              <span>
                <strong>Notification:</strong> You'll receive a confirmation message in your Telegram once verification is complete.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 flex-shrink-0">
                3
              </span>
              <span>
                <strong>Integration:</strong> After verification, the PayGate Prime bot will be added to your channels to handle subscriptions.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 flex-shrink-0">
                4
              </span>
              <span>
                <strong>Go Live:</strong> Once integrated, your subscription tiers will be active and users can start subscribing!
              </span>
            </li>
          </ol>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep your registration ID <strong>#{data.id}</strong> for future reference and support inquiries.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ensure you have admin access to both channels before the integration process.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Do not change your wallet address after registration. Contact support if changes are needed.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Payments will be processed automatically to your specified wallet address.</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
          >
            Register Another Channel
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://t.me/paygateprime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            Contact Support
          </motion.a>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Thank you for choosing PayGate Prime for your channel monetization needs!
        </motion.p>
      </div>
    </div>
  )
}

export default SuccessPage
