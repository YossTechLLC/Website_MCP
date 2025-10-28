import { RegistrationResponse } from '../types'

interface Props {
  data: RegistrationResponse
  onReset: () => void
}

const SuccessPage = ({ data, onReset }: Props) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your channel has been registered with PayGate Prime
          </p>
        </div>

        {/* Registration Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
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
        </div>

        {/* Next Steps Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Register Another Channel
          </button>
          <a
            href="https://t.me/paygateprime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            Contact Support
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Thank you for choosing PayGate Prime for your channel monetization needs!
        </p>
      </div>
    </div>
  )
}

export default SuccessPage
