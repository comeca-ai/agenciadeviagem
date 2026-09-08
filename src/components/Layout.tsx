import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-[100dvh] bg-ink text-mist">
      <Navbar />
      <main>{outlet}</main>
      <Footer />
    </div>
  );
}
