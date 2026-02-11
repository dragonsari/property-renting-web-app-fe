"use client";

import Link from "next/link";
import { Formik, Form } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import { ForgotPasswordConfirmSchema } from "@/views/ResetPassword/schema";

type FormValues = {
  password: string;
};

export default function ForgotPasswordPageConfirm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [message, setMessage] = useState<string | null>(null);

  const initialValues: FormValues = {
    password: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: any
  ) => {
    if (!token) {
      setMessage("Token tidak valid");
      setSubmitting(false);
      return;
    }

    try {
      setMessage(null);
      await authService.confirmResetPassword({
        token,
        newPassword: values.password,
      });

      alert("Password berhasil direset, silakan login");
      router.push("/login/user");
    } catch (e: any) {
      setMessage(e.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <Formik
        initialValues={initialValues}
        validationSchema={ForgotPasswordConfirmSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          isSubmitting,
        }) => (
          <Form className="bg-muted m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border shadow-md">
            <div className="bg-card p-8 pb-6">
              <div className="text-center">
                <Link href="/" className="mx-auto block w-fit">
                  <LogoIcon />
                </Link>

                <h1 className="mt-4 text-xl font-semibold">
                  Set New Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your new password below
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </Button>

                {message && (
                  <p className="text-center text-sm text-red-500">
                    {message}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 text-center text-sm">
              Back to
              <Button asChild variant="link" className="px-2">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
