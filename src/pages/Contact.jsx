import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, 
  FaComment, FaPaperPlane, FaLeaf, FaWhatsapp, 
  FaFacebookF, FaInstagram, FaGlobe,
  FaCheckCircle
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        toast.error('Please fill in all required fields')
        setSending(false)
        return
      }

      // Create mailto link
      const subject = `Message from ${formData.name} - Ayurchikitsak Clinic Inquiry`;
      const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone || 'Not provided'}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
      
      const mailtoLink = `mailto:ayurchikitsak05@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      toast.success('Opening your email app... Please send the message from there.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
    } catch (error) {
      console.error('Email error:', error);
      toast.error('Failed to open email app. Please try again or contact us directly.');
    } finally {
      setSending(false);
    }
  }

  const clinicInfo = {
    address: '637V+XGW, Tilak Nagar, Dombivli East, Dombivli, Maharashtra 421201, India',
    phone: '+91 877 970 3605',
    emergency: '+91 88503 25369',
    email: 'ayurchikitsak05@gmail.com',
    website: 'www.ayurchikitsak.com',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.181424678348!2d73.086927!3d19.218072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c1d8f7f8f8f9%3A0x8f8f8f8f8f8f8f8f!2sTilak%20Nagar%2C%20Dombivli%20East%2C%20Dombivli%2C%20Maharashtra%20421201!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 text-[300px] text-emerald-200/20"
        >
          <FaLeaf />
        </motion.div>
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 text-[300px] text-amber-200/20"
        >
          <FaLeaf className="rotate-45" />
        </motion.div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-ayurvedic font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-amber-800 mb-4">
            Get in Touch
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
            We're here to help you on your journey to wellness. Reach out to us for appointments, 
            consultations, or any questions about Ayurvedic treatments.
          </p>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Contact Form */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-ayurvedic font-bold text-gray-800">Send Message</h2>
                  <p className="text-gray-500">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">
                    <FaUser className="inline mr-2 text-emerald-600" />
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all outline-none group-hover:border-emerald-300"
                    placeholder="John Doe"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">
                      <FaEnvelope className="inline mr-2 text-emerald-600" />
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">
                      <FaPhone className="inline mr-2 text-emerald-600" />
                      Phone <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">
                    <FaComment className="inline mr-2 text-emerald-600" />
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all outline-none resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
                >
                  {sending ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Opening Email App...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Contact Info Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <a 
                href={`tel:${clinicInfo.phone}`}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <FaPhone className="text-emerald-700 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
                <p className="text-emerald-700 font-medium">{clinicInfo.phone}</p>
                <p className="text-sm text-gray-500 mt-2">24/7 Emergency</p>
                <p className="text-emerald-600 text-sm font-semibold">{clinicInfo.emergency}</p>
              </a>

              <a 
                href={`mailto:${clinicInfo.email}`}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-amber-700 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Email Us</h3>
                <p className="text-amber-700 font-medium break-all">{clinicInfo.email}</p>
                <p className="text-sm text-gray-500 mt-2">Direct Email</p>
                <p className="text-amber-600 text-sm font-semibold">Click to compose</p>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Large Map and Address */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Large Map Container */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-4 border border-white/20 h-[500px] overflow-hidden hover:shadow-3xl transition-all">
              <iframe
                title="Clinic Location"
                src={clinicInfo.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              ></iframe>
            </div>

            {/* Address Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-ayurvedic font-bold text-gray-800 mb-3">Visit Our Clinic</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {clinicInfo.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(clinicInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <FaGlobe />
                      <span>Get Directions</span>
                    </a>
                    <div className="flex space-x-2">
                      <a 
                        href="https://www.facebook.com/Dr.Chidanand.G.Patwardhan" 
                        className="p-3 bg-gray-100 rounded-xl hover:bg-emerald-100 hover:text-emerald-600 transition-all"
                        aria-label="Facebook"
                      >
                        <FaFacebookF />
                      </a>
                      <a 
                        href="https://www.instagram.com/dr.chidanand.patwardhan?igsh=MXV3MDhvamhwcGRhcg==" 
                        className="p-3 bg-gray-100 rounded-xl hover:bg-emerald-100 hover:text-emerald-600 transition-all"
                        aria-label="Instagram"
                      >
                        <FaInstagram />
                      </a>
                      <a 
                        href="https://wa.me/918850325369" 
                        className="p-3 bg-gray-100 rounded-xl hover:bg-emerald-100 hover:text-emerald-600 transition-all"
                        aria-label="WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Guarantee */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <FaCheckCircle className="text-4xl text-white/80 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Direct Email Delivery</h4>
                  <p className="text-white/80">
                    Your message goes directly to <span className="font-semibold">{clinicInfo.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Action Button for Emergency */}
        <motion.a
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          href={`tel:${clinicInfo.emergency}`}
          className="fixed bottom-8 right-8 bg-red-600 text-white p-5 rounded-full shadow-2xl hover:bg-red-700 transition-all z-50 flex items-center justify-center group"
        >
          <FaPhone className="text-2xl animate-pulse" />
          <span className="absolute right-full mr-3 bg-white text-red-600 px-4 py-2 rounded-xl font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Emergency: {clinicInfo.emergency}
          </span>
        </motion.a>
      </div>
    </div>
  )
}

export default Contact