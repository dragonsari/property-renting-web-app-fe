"use client";

import { useProfile } from "@/hooks/useProfile";
import { useAuthGuard } from "@/lib/authGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileView() {
  useAuthGuard();
  const router = useRouter();
  const {
    profile,
    updateProfile,
    updateEmail,
    resendVerification,
    updatePassword,
    message,
  } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!profile) return <p className="mt-20 text-center">Loading...</p>;

  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 mt-5">
      <Card>
        <button
        onClick={() => router.back()}
        aria-label="Back"
        className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

        <CardHeader className="items-center space-y-4 text-center">
          
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-muted text-2xl font-semibold mx-auto">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <CardTitle className="text-2xl">Account Settings</CardTitle>

          <p className="text-sm text-muted-foreground">
            Kelola informasi akun dan keamanan Anda
          </p>
        </CardHeader>


        <CardContent className="space-y-5">

          {!profile.isVerified && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm">
              <p className="mb-2 font-medium text-yellow-800">
                Email belum terverifikasi
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={resendVerification}
              >
                Kirim ulang email verifikasi
              </Button>
            </div>
          )}


          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profil</h3>

            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                defaultValue={profile.name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Foto Profil</Label>
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button onClick={() => updateProfile(name, file ?? undefined)}>
              Update Profil
            </Button>
          </div>

        
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Email</h3>

            <div className="space-y-2">
              <Label>Email Baru</Label>
              <Input
                placeholder="email@baru.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button variant="outline" onClick={() => updateEmail(email)}>
              Update Email
            </Button>
          </div>

          
          {profile.provider === "EMAIL" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Password</h3>

              <div className="space-y-2">
                <Label>Password Lama</Label>
                <Input
                  type="password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password Baru</Label>
                <Input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  updatePassword(currentPassword, newPassword)
                }
              >
                Update Password
              </Button>
            </div>
          )}

          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
