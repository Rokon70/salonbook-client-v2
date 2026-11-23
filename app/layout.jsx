import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: { default: "SalonBook – Hair, skin & calm, booked beautifully", template: "%s | SalonBook" },
  description: "Discover salon services, request your favourite time slot and pay securely once confirmed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative flex min-h-screen flex-col font-sans">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-berry-100/50 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-gold-100/60 blur-3xl" />
        </div>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3800,
            style: { borderRadius: "14px", background: "#241327", color: "#fff", fontSize: "14px", boxShadow: "0 20px 50px -20px rgba(36,19,39,.6)" },
            success: { iconTheme: { primary: "#E7C878", secondary: "#241327" } },
          }}
        />
      </body>
    </html>
  );
}
