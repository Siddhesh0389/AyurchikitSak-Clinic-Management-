import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaLeaf, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'
import logo from '/src/assets/logo.png'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-gradient-to-r from-green-900 to-green-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Ayurchikitsak" className="h-10 w-auto rounded-3xl" />
              <span className="text-xl font-ayurvedic font-bold">Ayurchikitsak</span>
            </div>
            <p className="text-green-100 mb-4">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Dr.Chidanand.G.Patwardhan" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-green-300 hover:text-white transition-colors"
                 aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-green-300 hover:text-white transition-colors"
                 aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/dr.chidanand.patwardhan?igsh=MXV3MDhvamhwcGRhcg==" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-green-300 hover:text-white transition-colors"
                 aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtu.be/Ng6zHBwPDDA?si=xq-wTrVYhqTs_2gD" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-green-300 hover:text-white transition-colors"
                 aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/live-status" className="text-green-100 hover:text-white transition-colors">
                  {t('nav.liveStatus')}
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-green-100 hover:text-white transition-colors">
                  {t('nav.bookOnline')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-100 hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-green-100 hover:text-white transition-colors">
                  {t('nav.adminLogin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinic Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.clinicHours')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-green-100">
                <FaClock className="text-secondary-300 flex-shrink-0" />
                <span>{t('footer.morningHours')}</span>
              </li>
              <li className="flex items-center space-x-2 text-green-100">
                <FaClock className="text-secondary-300 flex-shrink-0" />
                <span>{t('footer.eveningHours')}</span>
              </li>
              <li className="flex items-center space-x-2 text-green-100">
                <FaClock className="text-secondary-300 flex-shrink-0" />
                <span>{t('footer.sundayHours')}</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-green-100">
                <FaMapMarkerAlt className="text-secondary-300 mt-1 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center space-x-2 text-green-100">
                <FaPhone className="text-secondary-300 flex-shrink-0" />
                <a href="tel:+918850325369" className="hover:text-white transition-colors">
                  +91 88503 25369
                </a>
              </li>
              <li className="flex items-center space-x-2 text-green-100">
                <FaEnvelope className="text-secondary-300 flex-shrink-0" />
                <a href="mailto:ayurchikitsak05@gmail.com" className="hover:text-white transition-colors">
                  ayurchikitsak05@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer