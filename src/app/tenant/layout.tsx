"use client"
import AppSidebar from "@/views/Navbar/sidebar";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {token, role, isVerified} = useAuthStore();
  const router = useRouter();

  useEffect(()=>{
    if(!token){
      router.replace("/login/tenant");
      return;
    }

    if(!isVerified){
      router.replace("/verify-email");
      return;
    }

    if(role !== "TENANT"){
      router.replace("/");
      return;
    }

  },[token, role, isVerified, router]);

  if(!token || role !== "TENANT" || !isVerified){
    return null;
  }
  return (
    <div className="flex h-screen">
      <AppSidebar />

      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
