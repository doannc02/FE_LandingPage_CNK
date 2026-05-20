import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Suspense } from "react";

export default function CoSoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
