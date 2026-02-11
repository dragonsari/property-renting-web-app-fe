"use client";

import Link from "next/link";
import { Formik, Form, FormikHelpers } from "formik";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRegister } from "@/hooks/useRegister";
import { useResendVerification } from "@/hooks/useResendVerification";
import { RegisterUserSchema } from "../schema";
import SocialLogin from "@/components/auth/SocialLogin";

type RegisterUserValues = {
  email: string;
};

export default function RegisterUserPage() {
  const { registerUser, loading, error } = useRegister();
  const { resend, loading: resendLoading, message } = useResendVerification();

  const initialValues: RegisterUserValues = {
    email: "",
  };

  const handleSubmit = async (
    values: RegisterUserValues,
    { setSubmitting }: FormikHelpers<RegisterUserValues>
  ) => {
    try {
      await registerUser(values.email);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32">
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterUserSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form className="bg-card m-auto w-full max-w-sm rounded border shadow-md">
            <div className="p-8 pb-6">
              <Link href="/" aria-label="go home">
                <LogoIcon />
              </Link>

              <h1 className="mt-4 text-xl font-semibold">
                Create a Property Renting Account
              </h1>
              <p className="text-sm">
                Welcome! Create an account to get started
              </p>

              <div className="mt-6">
                <SocialLogin role="USER" />
              </div>

              <hr className="my-4 border-dashed" />

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {error && (
                  <p className="text-center text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>

            <div className="px-8 pb-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Belum menerima email verifikasi?
              </p>

              <Button
                type="button"
                variant="link"
                disabled={resendLoading || !values.email}
                onClick={() => resend(values.email)}
              >
                {resendLoading ? "Mengirim..." : "Kirim ulang verifikasi"}
              </Button>

              {message && (
                <p className="text-sm text-green-600">{message}</p>
              )}
            </div>

            <div className="bg-muted rounded-(--radius) border p-3">
              <p className="text-accent-foreground text-center text-sm">
                Have an account?
                <Button asChild type="button" variant="link" className="px-2">
                  <Link href="/login/user" >
                    Sign In
                  </Link>
                </Button>
                
              </p>

              <p className="text-accent-foreground text-center text-sm">
                Sign Up as?
                <Button asChild variant="link" className="px-2">
                  <Link href="/RegisterTenant">Tenant</Link>
                </Button> 
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
