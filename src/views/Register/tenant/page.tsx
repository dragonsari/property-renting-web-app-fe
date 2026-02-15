"use client";

import Link from "next/link";
import { Formik, Form, FormikHelpers } from "formik";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/useRegister";
import { RegisterTenantSchema } from "../schema";
import SocialLogin from "@/components/auth/SocialLogin";
import { useResendVerification } from "@/hooks/useResendVerification";

type RegisterTenantValues = {
  email: string;
  companyName: string;
  phoneNumber: string;
};

export default function RegisterTenantPage() {
  const { registerTenant, loading, error } = useRegister();
  const {resend, loading: resendLoading, message} = useResendVerification();

  const initialValues: RegisterTenantValues = {
    email: "",
    companyName: "",
    phoneNumber: "",
  };

  const handleSubmit = async (
    values: RegisterTenantValues,
    { setSubmitting }: FormikHelpers<RegisterTenantValues>
  ) => {
    try {
      await registerTenant(
        values.email,
        values.companyName,
        values.phoneNumber
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent"
      id="register"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterTenantSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <div className="p-8 pb-6">
              <div>
                <Link href="/" aria-label="go home">
                  <LogoIcon />
                </Link>

                <h1 className="mb-1 mt-4 text-xl font-semibold">
                  Create a Property Renting Account
                </h1>
                <p className="text-sm">
                  Register as a tenant to start listing your property
                </p>
              </div>

            
              <div className="mt-6">
                <SocialLogin role="TENANT" />
              </div>

              <hr className="my-4 border-dashed" />

              <div className="space-y-5">

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
                    <p className="text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={values.companyName}
                    onChange={handleChange}
                  />
                  {touched.companyName && errors.companyName && (
                    <p className="text-sm text-red-500">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={values.phoneNumber}
                    onChange={handleChange}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-center text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center space-y-2">
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
                <p className="text-sm text-green-600">
                  {message}
                </p>
              )}
            </div>


            <div className="bg-muted rounded-(--radius) border p-3">
              <p className="text-accent-foreground text-center text-sm">
                Have an account?
                <Button asChild type="button" variant="link" className="px-2">
                  <Link href="/login/tenant">Sign In</Link>
                </Button>
              </p>

              <p className="text-accent-foreground text-center text-sm">
                Sign Up as?
                <Button asChild variant="link" className="px-2">
                  <Link href="/RegisterUser">User</Link>
                </Button>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
