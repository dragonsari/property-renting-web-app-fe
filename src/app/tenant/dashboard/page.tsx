import ReservationList from '@/views/tenant/components/reservationList';

export default function TenantDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e293b] mb-8">Dashboard Tenant</h1>
        <ReservationList />
      </div>
    </div>
  );
}