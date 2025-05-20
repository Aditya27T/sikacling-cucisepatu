/* ContactSection.tsx */
import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
    subject: 'general' // default subject
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validasi sederhana
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.message) {
      setError('Mohon lengkapi semua kolom yang diperlukan');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulasi pengiriman data ke backend
      // Dalam implementasi nyata, Anda akan mengirim data ke backend Anda
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form dan tampilkan pesan sukses
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
        subject: 'general'
      });
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ada pertanyaan atau butuh bantuan? Jangan ragu untuk menghubungi tim kami.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden">
            {/* Contact Info */}
            <div className="md:w-2/5 bg-primary p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Informasi Kontak</h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Alamat</h4>
                    <p className="text-sm">Jl. Contoh No. 123, Jakarta, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Telepon</h4>
                    <p className="text-sm">+62 812 3456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-sm">hello@sikacling.id</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Jam Operasional</h4>
                    <p className="text-sm">Senin - Minggu: 08:00 - 20:00</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Ikuti Kami</h4>
                <div className="flex space-x-3">
                  <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:w-3/5 p-8">
              <h3 className="text-xl font-bold mb-6">Kirim Pesan</h3>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-check text-green-500"></i>
                    </div>
                    <h4 className="text-lg font-semibold">Pesan Terkirim!</h4>
                  </div>
                  <p className="mb-4">Terima kasih telah menghubungi kami. Tim SikaCling akan segera meninjau pesan Anda dan menghubungi Anda kembali.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Kirim Pesan Lagi
                  </button>
                </div>
              ) : (
                <div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subjek
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="general">Pertanyaan Umum</option>
                        <option value="booking">Booking</option>
                        <option value="tracking">Tracking</option>
                        <option value="complaint">Keluhan</option>
                        <option value="partnership">Kerja Sama</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </div>
                    ) : (
                      "Kirim Pesan"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;