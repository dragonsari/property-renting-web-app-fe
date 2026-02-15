const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  //Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  //properties
  getProperties: async () => {
    const res = await fetch(`${API_URL}/api/properties`);
    return res.json();
  },

  getPropertyById: async (id: number) => {
    const res = await fetch(`${API_URL}/api/properties/${id}`);
    return res.json();
  },

  //orders
  createOrder: async (data: any, token: string) => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMyOrders: async (token: string, filters?: any) => {
    let url = `${API_URL}/api/orders/my-orders`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.orderNo) params.append('orderNo', filters.orderNo);
      if (filters.status) params.append('status', filters.status);
      url += `?${params.toString()}`;
    }
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  uploadPaymentProof: async (orderId: number, file: File, token: string) => {
    const formData = new FormData();
    formData.append('paymentProof', file);
    const res = await fetch(`${API_URL}/api/orders/${orderId}/payment`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  cancelOrder: async (orderId: number, token: string) => {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  //tenant orders
  getTenantOrders: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/tenant/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  confirmPayment: async (orderId: number, token: string, note?: string) => {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/confirm`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ note })
    });
    return res.json();
  },

  rejectPayment: async (orderId: number, reason: string, token: string) => {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  //reports
  getSalesReport: async (startDate: string, endDate: string, token: string) => {
    const res = await fetch(`${API_URL}/api/orders/reports/sales?startDate=${startDate}&endDate=${endDate}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getPropertyReport: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/reports/properties`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  //reviews
  createReview: async (data: any, token: string) => {
    const res = await fetch(`${API_URL}/api/orders/${data.orderId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getPropertyReviews: async (propertyId: number) => {
    const res = await fetch(`${API_URL}/api/reviews/property/${propertyId}`);
    return res.json();
  },

  replyToReview: async (reviewId: number, reply: string, token: string) => {
    const res = await fetch(`${API_URL}/api/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reply })
    });
    return res.json();
  },

  // orders reminders
  getOrderReminders: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/tenant/reminders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  
  
};