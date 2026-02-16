// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Response
export interface AuthResponse {
  token: string;
  user: AdminUser;
}

// Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  images: string[];
  thumbnail: string;
  facilities: string[];
  rating: number; // 1-5
  pricePerNight: number;
  currency: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// Transport Types
export interface Transport {
  id: string;
  name: string;
  type: 'car' | 'bus' | 'van' | 'motorcycle';
  description: string;
  capacity: number;
  licensePlate: string;
  image: string;
  inclusions: string[];
  features: string[]; // e.g. ["AC", "WiFi", "Driver"]
  driverName: string;
  driverPhone: string;
  pricePerDay: number;
  currency: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// Paket Tour Types
export interface PaketTour {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  destination: string;
  images: string[];
  thumbnail: string;
  itinerary: ItineraryDay[];
  priceAdult: number;
  priceChild: number;
  groupDiscount: number; // percentage
  currency: string;
  inclusions: string[];
  exclusions: string[];
  maxPax: number;
  minPax: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meal: string;
}

// Booking Types
export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  pax: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Media Types
export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'document';
  mimeType: string;
  size: number;
  folder?: string;
  uploadedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
