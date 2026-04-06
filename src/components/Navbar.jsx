import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { FaLeaf, FaUserMd, FaCalendarCheck, FaChartLine, FaSignOutAlt, FaBars, FaTimes, FaPhone } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', name: t('nav.home'), icon: FaLeaf },
    { path: '/live-status', name: t('nav.liveStatus'), icon: FaChartLine },
    { path: '/booking', name: t('nav.bookOnline'), icon: FaCalendarCheck },
    { path: '/contact', name: t('nav.contact'), icon: FaPhone },
    ...(isAuthenticated ? [{ path: '/admin', name: t('nav.dashboard'), icon: FaUserMd }] : [])
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img 
                src="/src/assets/logo.png" 
                alt="Ayurchikitsak" 
                className="h-12 w-auto relative z-10 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-ayurvedic font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                Ayurchikitsak
              </span>
              <span className="text-xs text-gray-600 -mt-1">Ayurvedic Clinic</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
                }`}
              >
                <link.icon className="text-lg" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaSignOutAlt />
                <span>{t('nav.logout')}</span>
              </button>
            )}
            
            {!isAuthenticated && location.pathname !== '/admin/login' && (
              <Link
                to="/admin/login"
                className="ayurvedic-button"
              >
                {t('nav.adminLogin')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700 hover:text-primary-600 transition-colors"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 space-y-2">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === link.path
                        ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <link.icon className="text-xl" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
                
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
                
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <FaSignOutAlt className="text-xl" />
                    <span className="font-medium">{t('nav.logout')}</span>
                  </button>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="block ayurvedic-button text-center"
                  >
                    {t('nav.adminLogin')}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar