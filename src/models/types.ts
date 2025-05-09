// models/types.ts
export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Booking {
  id: string;
  orderNumber: string;
  name: string;
  phone: string;
  serviceId: string;
  date: string;
  address: string;
  status: string;
  createdAt: Date;
}

export interface Status {
  id: string;
  bookingId: string;
  status: string;
  timestamp: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  text: string;
}