// lib/hooks/useGoogleSheets.ts
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface SyncData {
  data: any[];
  type: 'contact' | 'registration' | 'stats';
}

/**
 * Hook để sync data lên Google Sheets
 */
export const useSyncToSheets = () => {
  return useMutation({
    mutationFn: async ({ data, type }: SyncData) => {
      const response = await axios.post('/api/sync-to-sheets', {
        data,
        type,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Synced to Google Sheets:', data);
    },
    onError: (error: any) => {
      console.error('❌ Sync error:', error);
      throw new Error(error.response?.data?.error || 'Lỗi khi sync Google Sheets');
    }
  });
};

/**
 * Hook để sync tất cả data từ backend lên Google Sheets
 */
export const useSyncAllToSheets = () => {
  return useMutation({
    mutationFn: async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // Fetch all data from backend
      const [contactsRes, registrationsRes] = await Promise.all([
        axios.get(`${API_URL}/contact?limit=1000`),
        axios.get(`${API_URL}/registration?limit=1000`),
      ]);

      const contacts = contactsRes.data.data || [];
      const registrations = registrationsRes.data.data || [];

      // Calculate stats
      const allSubmissions = [...contacts, ...registrations];
      const stats = {
        total: allSubmissions.length,
        pending: allSubmissions.filter(s => s.status === 'pending').length,
        contacted: allSubmissions.filter(s => s.status === 'contacted').length,
        enrolled: allSubmissions.filter(s => s.status === 'enrolled').length,
        rejected: allSubmissions.filter(s => s.status === 'rejected').length,
      };

      // Sync each type
      const results = await Promise.all([
        axios.post('/api/sync-to-sheets', { data: contacts, type: 'contact' }),
        axios.post('/api/sync-to-sheets', { data: registrations, type: 'registration' }),
        axios.post('/api/sync-to-sheets', { data: stats, type: 'stats' }),
      ]);

      return {
        contacts: results[0].data,
        registrations: results[1].data,
        stats: results[2].data,
      };
    },
    onSuccess: (data) => {
      console.log('✅ All data synced to Google Sheets:', data);
    },
    onError: (error: any) => {
      console.error('❌ Sync all error:', error);
      throw error;
    }
  });
};

export default {
  useSyncToSheets,
  useSyncAllToSheets,
};