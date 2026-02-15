"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconArrowLeft,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useAuthStore } from "@/stores/auth.store";

export default function AppSidebar() {
  const{role, isVerified} = useAuthStore();
  const [open, setOpen] = useState(false);

  const links = [
    ...(isVerified && role === "TENANT"
      ? [
          {
            label: "Dashboard",
            href: "/tenant/properties",
            icon: <IconBrandTabler className="h-5 w-5" />,
          },
        ]
      : []),

    ...(isVerified
      ? [
          {
            label: "Profile",
            href: "/profile",
            icon: <IconUserBolt className="h-5 w-5" />,
          },
        ]
      : []),

    {
      label: "Home",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5" />,
    },
  ];


  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}

          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => (
  <div className="flex items-center gap-2 py-2 font-medium">
    <div className="h-5 w-6 rounded bg-black dark:bg-white" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Property App
    </motion.span>
  </div>
);

const LogoIcon = () => (
  <div className="h-5 w-6 rounded bg-black dark:bg-white" />
);
