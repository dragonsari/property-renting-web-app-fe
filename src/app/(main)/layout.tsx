import { HeroHeader } from "@/views/Navbar/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeroHeader />
      {children}
    </>
  );
}
