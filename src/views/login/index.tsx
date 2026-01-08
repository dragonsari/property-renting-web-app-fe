import LoginForm from "./components/loginForm";

export default function LoginView() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">LOGIN</h1>
      <LoginForm />
    </div>
  );
}
