"use client";

import Link from "next/link";
import { Formik, Form } from "formik";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ForgotPasswordRequestSchema } from "../schema";
import { useForgotPassword } from "@/hooks/useForgotPassword";

type FormValues = {
  email: string;
};

export default function ForgotPasswordPageRequest() {
  const { requestReset } = useForgotPassword();

  const initialValues: FormValues = { email: "" };

  const handleSubmit = async (values: FormValues) => {
    await requestReset(values.email);
    alert("Reset link sent to your email");
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <Formik
        initialValues={initialValues}
        validationSchema={ForgotPasswordRequestSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="bg-muted m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border shadow-md">
            <div className="bg-card p-8 pb-6">
              <div className="text-center">
                <Link href="/" className="mx-auto block w-fit">
                  <LogoIcon />
                </Link>

                <h1 className="mt-4 text-xl font-semibold">
                  Recover Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a reset link
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                We’ll send you a link to reset your password.
              </p>
            </div>

            <div className="p-3 text-center text-sm">
              Remembered your password?
              <Button asChild variant="link" className="px-2">
                <Link href="/login/user">Log in</Link>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}

