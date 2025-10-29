import { motion } from 'framer-motion'
import {
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

interface Props {
  onGetStarted: () => void
  onSignup: () => void
  onLogin: () => void
}

const LandingPage = ({ onGetStarted, onSignup, onLogin }: Props) => {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Easy Setup',
      description: 'Get your premium Telegram channel up and running in minutes with our streamlined registration process.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Crypto Payments',
      description: 'Accept payments in multiple cryptocurrencies across various blockchain networks.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with reCAPTCHA protection and encrypted transactions.'
    },
    {
      icon: ChartBarIcon,
      title: 'Flexible Pricing',
      description: 'Create up to 3 subscription tiers with custom pricing and duration to fit your audience.'
    },
    {
      icon: UserGroupIcon,
      title: 'Member Management',
      description: 'Automatically manage access to your premium content based on subscription status.'
    },
    {
      icon: BoltIcon,
      title: 'Instant Payouts',
      description: 'Receive your earnings directly to your crypto wallet with fast processing times.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Register Your Channels',
      description: 'Provide details about your open and premium Telegram channels.'
    },
    {
      number: '02',
      title: 'Set Your Pricing',
      description: 'Configure subscription tiers with your preferred pricing and duration.'
    },
    {
      number: '03',
      title: 'Connect Wallet',
      description: 'Link your crypto wallet to receive payments in your chosen currency.'
    },
    {
      number: '04',
      title: 'Start Earning',
      description: 'Share your channel link and start accepting premium subscriptions.'
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Navigation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 right-0 z-20 py-6 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-white font-bold text-xl">
              PayGate Prime
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogin}
                className="px-6 py-2 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignup}
                className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
              backgroundSize: '100% 100%',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 border border-white/30">
                Premium Telegram Monetization Platform
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Monetize Your
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                Telegram Channel
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Turn your Telegram community into a sustainable business with crypto-powered subscriptions.
              Simple setup, secure payments, instant earnings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free
                <RocketLaunchIcon className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                View Demo
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
            >
              {[
                { value: '10K+', label: 'Active Channels' },
                { value: '50+', label: 'Cryptocurrencies' },
                { value: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you grow and monetize your Telegram community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in 4 simple steps and start earning today
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent" />
                )}

                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are already monetizing their Telegram channels with PayGate Prime
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 inline-flex items-center gap-3"
          >
            Register Your Channel Now
            <RocketLaunchIcon className="w-7 h-7" />
          </motion.button>

          <p className="mt-6 text-white/70 text-sm">
            No credit card required • Free to get started • Setup in minutes
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">PayGate Prime</h3>
          <p className="text-gray-400 mb-6">
            The future of Telegram channel monetization
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            © 2025 PayGate Prime. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
