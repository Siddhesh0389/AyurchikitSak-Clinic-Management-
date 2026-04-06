import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaLeaf, FaUserMd, FaPills, FaSpa, FaQuoteLeft, FaStar, 
  FaClock, FaPhone, FaMapMarkerAlt, FaChevronLeft, FaChevronRight,
  FaBullhorn, FaTimes 
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'
import img1 from '/src/assets/Images/Img_1.png'
import img2 from '/src/assets/Images/Img_2.png'
import img3 from '/src/assets/Images/Img_3.png'
import img4 from '/src/assets/Images/Img_4.png'
import img5 from '/src/assets/Images/Img_5.png'
import img6 from '/src/assets/Images/Doctor.png'
import trifala from '/src/assets/Images/trifala.png'
import ashwagandha from '/src/assets/Images/ashwagandha.png'
import brahmi from '/src/assets/Images/brahmi.png'
import shilajit from '/src/assets/Images/shilajit.png'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [announcement, setAnnouncement] = useState({ message: '', hasAnnouncement: false })
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
  // Fetch announcement on component mount
  useEffect(() => {
    fetchAnnouncement()
  }, [])

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/announcement`)
      console.log('Announcement fetched:', response.data)
      setAnnouncement(response.data)
      setShowAnnouncement(true)
    } catch (error) {
      console.error('Failed to fetch announcement:', error)
    }
  }

  const galleryImages = [
    {
      url: img1,
      title: 'Ayurvedic Treatment Room'
    },
    {
      url: img2,
      title: 'Doctors Consultation'
    },
    {
      url: img3,
      title: 'Doctor Patient Interaction'
    },
    {
      url: img4,
      title: 'Waiting Room'
    },
    {
      url: img5,
      title: 'Medicine Area'
    }
  ]

  const medicines = [
    { name: "Triphala Churna", desc: "Digestive health & detoxification", price: "₹199", image: trifala },
    { name: "Ashwagandha", desc: "Stress relief & vitality", price: "₹199", image: ashwagandha },
    { name: "Brahmi", desc: "Memory & concentration", price: "₹249", image: brahmi },
    { name: "Shilajit", desc: "Energy & stamina", price: "₹249", image: shilajit }
  ]

  const facilities = [
    { icon: FaUserMd, title: "Expert Doctor", desc: "20+ years experience" },
    { icon: FaLeaf, title: "Pure Herbs", desc: "Organic ingredients" },
    { icon: FaSpa, title: "Panchakarma", desc: "Traditional therapy" },
    { icon: FaPills, title: "Custom Medicines", desc: "Personalized treatment" }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Announcement Banner - Positioned below navbar */}
      <AnimatePresence>
        {announcement.hasAnnouncement && showAnnouncement && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 sticky top-20 z-40 shadow-lg"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <FaBullhorn className="text-xl animate-pulse flex-shrink-0" />
                <p className="font-medium text-sm md:text-base">{announcement.message}</p>
              </div>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 ml-4"
                aria-label="Close announcement"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Removed background blur */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Simple solid color background - no image, no blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-amber-50"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-ayurvedic text-primary-800 font-bold mb-4">
              Ayurchikitsak
            </h1>
            <p className="text-xl text-gray-700 md:text-2xl mb-8 max-w-2xl mx-auto">
              Experience the Ancient Wisdom of Ayurveda in Modern Times
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="ayurvedic-button text-lg">
                Book Appointment
              </Link>
              <Link to="/live-status" className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-md">
                View Live Status
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-600 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Doctor Info Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-ayurvedic font-bold text-gray-800 mb-4">
              Meet Our Expert
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl transform rotate-6"></div>
                <img 
                  src={img6} 
                  alt="Dr. C. Patwardhan"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-2/3"
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Dr. Chidanand G. Patwardhan</h3>
              <p className="text-xl text-primary-600 mb-4">BAMS, MD (Ayurveda) - 20+ Years Experience</p>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  Dr. Chidanand G. Patwardhan is a renowned Ayurvedic practitioner with over two decades of experience 
                  in treating chronic diseases through traditional Ayurvedic methods. He specializes in 
                  Panchakarma, herbal medicine, and lifestyle counseling.
                </p>
                <p>
                  His approach combines ancient wisdom with modern diagnostic techniques to provide 
                  personalized treatment plans for each patient. He has successfully treated thousands 
                  of patients suffering from various ailments including arthritis, digestive disorders, 
                  stress, and chronic pain.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-primary-600">20+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-primary-600">10k+</div>
                  <div className="text-gray-600">Happy Patients</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-ayurvedic font-bold text-gray-800 mb-4">
              Our Facilities
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="premium-card p-6 text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-5xl text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  <facility.icon className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{facility.title}</h3>
                <p className="text-gray-600">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Medicines Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-ayurvedic font-bold text-gray-800 mb-4">
              Our Ayurvedic Medicines
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicines.map((medicine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${medicine.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                  <p className="text-gray-600 mb-4">{medicine.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">{medicine.price}</span>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-ayurvedic font-bold text-gray-800 mb-4">
              Clinic Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-64 md:h-80 lg:h-[420px]"
                >
                  <img
                    src={galleryImages[currentSlide].url}
                    alt={galleryImages[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-lg md:text-xl font-semibold">
                      {galleryImages[currentSlide].title}
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg"
            >
              <FaChevronLeft className="text-primary-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg"
            >
              <FaChevronRight className="text-primary-600" />
            </button>

            <div className="flex justify-center mt-4 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-primary-600"
                      : "w-2 bg-gray-300 hover:bg-primary-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-ayurvedic font-bold text-gray-800 mb-4">
              Watch Our Clinic Overview
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Ng6zHBwPDDA"
                title="Clinic Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-white text-sm md:text-base">
            <div className="flex items-center mb-2 md:mb-0">
              <FaClock className="mr-2 flex-shrink-0" />
              <span>Mon-Sat: 10:00 AM - 12:30 PM, 5:00 PM - 8:30 PM</span>
            </div>
            <div className="flex items-center mb-2 md:mb-0">
              <FaPhone className="mr-2 flex-shrink-0" />
              <span>+91 88503 25369</span>
            </div>
            <div className="flex items-center text-center md:text-left">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span>637V+XGW, Tilak Nagar, Dombivli East, Dombivli, Maharashtra 421201</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home