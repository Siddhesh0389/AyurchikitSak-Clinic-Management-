// Run this in browser console when logged in
const token = localStorage.getItem('token');
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

const testApi = async (url) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(`✅ ${fullUrl}:`, data);
    return true;
  } catch (error) {
    console.error(`❌ ${url}:`, error);
    return false;
  }
};

const testAllApis = async () => {
  console.log('Testing all APIs...');
  console.log('API URL:', API_URL);
  
  await testApi('/admin/dashboard/stats');
  await testApi('/admin/seats');
  await testApi('/admin/patients/today');
  await testApi('/admin/requests/pending');
  await testApi('/admin/timings');
  await testApi('/admin/live-status');
};

testAllApis();