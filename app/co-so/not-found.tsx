import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function BranchesNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '28rem',
      }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: 'var(--color-gray-50)',
          border: '1px solid var(--color-gray-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <MapPin size={28} style={{ color: 'var(--color-gray-300)' }} />
        </div>

        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-gray-900)',
            marginBottom: '0.5rem',
          }}>
            Cơ sở không tồn tại
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-gray-500)',
            lineHeight: 1.65,
          }}>
            Cơ sở bạn đang tìm kiếm không tồn tại hoặc đã ngừng hoạt động.
          </p>
        </div>

        <Link
          href="/co-so"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--gradient-primary)',
            color: 'var(--color-white)',
            fontWeight: 700,
            fontSize: '0.875rem',
            padding: '0.625rem 1.375rem',
            borderRadius: 'var(--radius-lg)',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
          }}
        >
          <ArrowLeft size={15} />
          Quay lại danh sách cơ sở
        </Link>
      </div>
    </div>
  );
}
