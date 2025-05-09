// components/home/Testimonials.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import { Testimonial } from '@/models/types';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('rating', { ascending: false });
        
        if (error) throw error;
        
        const testimonialsData = data.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          rating: item.rating,
          text: item.text
        })) as Testimonial[];
        
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchTestimonials();
    }
  }, [isMounted]);
  
  if (!isMounted) {
    return null;
  }

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (halfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Apa Kata Pelanggan Kami?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Testimoni dari pelanggan yang puas dengan layanan kami</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(index => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className="w-4 h-4 mr-1 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 relative mr-4">
                    <Image 
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;