// app/admin/services/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { Service } from '@/models/types';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (service : Partial<Service> | null = null) => {
    if (service) {
      setCurrentService(service);
      setFormData({
        name: service.name,
        price: service.price,
        description: service.description,
        imageUrl: service.imageUrl
      } as any);
    } else {
      setCurrentService(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };
  
  const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description,
        imageUrl: formData.imageUrl
      };
      
      if (currentService && currentService.id) {
        // Update existing service
        await updateDoc(doc(db, 'services', currentService.id), serviceData);
      } else {
        // Add new service
        await addDoc(collection(db, 'services'), serviceData);
      }
      
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };
  
  const handleDelete = async (id : string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manajemen Layanan</h1>
        <button 
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md"
          onClick={() => handleOpenModal()}
        >
          <i className="fas fa-plus mr-2"></i> Tambah Layanan
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Layanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Rp {service.price.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={service.imageUrl || '/placeholder.jpg'} 
                            alt={service.name}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-primary hover:text-secondary mr-3"
                        onClick={() => handleOpenModal(service)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(service.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data layanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md"
                >
                  {currentService ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}