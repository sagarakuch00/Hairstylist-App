

export const API_BASE = 'https://localhost:7154/api';

export const API = {

  // ---------------- AUTH ----------------
  auth: `${API_BASE}/auth`,

  // ---------------- USERS ----------------
  users: `${API_BASE}/users`,
  userProfile: `${API_BASE}/user/profile`,
  userRole: `${API_BASE}/user/role`,

  // ---------------- INSTRUCTOR ----------------
  instructorProfile: `${API_BASE}/instructor/profile`,
  instructorDashboard: `${API_BASE}/instructor/dashboard`,


  // ---------------- BOOKINGS ----------------
  bookings: `${API_BASE}/bookings`,
  bookingByUser: (userId: string) =>
    `${API_BASE}/bookings/user/${userId}`,
  
bookingsByInstructor: `${API_BASE}/bookings/instructor/my`,


  bookingDetails: (bookingId: string) =>
    `${API_BASE}/bookings/details/${bookingId}`,
  cancelBooking: (bookingId: string) =>
    `${API_BASE}/bookings/cancel/${bookingId}`,

  // ---------------- BATCHES ----------------
  batches: `${API_BASE}/batches`,
 batchesManage: `${API_BASE}/batches/manage`,
  batchesByService: (serviceId: string) =>
    `${API_BASE}/batches/service/${serviceId}`,
  batchesByInstructor: (instructorId: string) =>
    `${API_BASE}/batches/instructor/${instructorId}`,
  batchById: (batchId: string) =>
    `${API_BASE}/batches/${batchId}`,

  // ---------------- SERVICES ----------------
  services: `${API_BASE}/services`,
  servicesManage: `${API_BASE}/services/manage`,

  // ---------------- PAYMENTS ----------------
  payments: `${API_BASE}/payments`,
  createPaymentOrder: `${API_BASE}/payments/create-order`,
  verifyPayment: `${API_BASE}/payments/verify`
};
