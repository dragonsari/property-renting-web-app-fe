"use client";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Formik, Form } from "formik";
import LoginSchema from "./schema";
import { useLogin } from "@/hooks/useLogin";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { LoginBody } from "@/type/auth.type";
import { GoogleLogin } from "@react-oauth/google";

type Props = {
  role: "USER" | "TENANT";
};

export default function LoginPage({ role }: Props) {
  const { login } = useLogin(role);
  const { login: socialLogin } = useSocialLogin(role);

  const initialValues: LoginBody = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginBody) => {
    await login(values.email, values.password);
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32">
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="bg-card m-auto w-full max-w-sm rounded border shadow-md">
            <div className="p-8 pb-6">
              <Link href="/" aria-label="go home">
                <LogoIcon />
              </Link>

              <h1 className="mt-4 text-xl font-semibold">
                {role === "TENANT" ? "Tenant Login" : "User Login"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to continue
              </p>

              
              <div className="mt-6">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (!credentialResponse.credential) return;
                    await socialLogin("google", {
                      token: credentialResponse.credential,
                    });
                  }}
                  onError={() => alert("Google Login Failed")}
                />
              </div>

              <hr className="my-4 border-dashed" />


              <div className="space-y-6">
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label>Password</Label>
                    <Link
                      href="/reset-password"
                      className="text-sm text-blue-600"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </div>

            <div className="border-t p-3 text-center text-sm space-y-1">
              <p>
                Don&apos;t have an account?
                <Link
                  href={role === "USER" ? "/RegisterUser" : "/RegisterTenant"}
                  className="ml-1"
                >
                  Register
                </Link>
              </p>

              <p>
                Login as{" "}
                <Link
                  href={role === "TENANT" ? "/login/user" : "/login/tenant"}
                  className="ml-1"
                >
                  {role === "TENANT" ? "User" : "Tenant"}
                </Link>
              </p>
            </div>

          </Form>
        )}
      </Formik>
    </section>
  );
}
