"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TenantGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const {isLoggedin , role} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if ( role !== 'tenant') {
            router.push('/');
        }
    }, [isLoggedin, role, router]);
    return <>{children}</>;
}
