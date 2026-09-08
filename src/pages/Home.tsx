import { useEffect } from "react";
import { useLocation } from "react-router";
import Hero from "@/components/home/Hero";
import Method from "@/components/home/Method";
import Highlights from "@/components/home/Highlights";
import Manifesto from "@/components/home/Manifesto";
import LendaTeaser from "@/components/home/LendaTeaser";
import CtaHorizonte from "@/components/home/CtaHorizonte";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#busca") {
      const t = setTimeout(() => {
        document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  return (
    <>
      <Hero />
      <Method />
      <Highlights />
      <Manifesto />
      <LendaTeaser />
      <CtaHorizonte />
    </>
  );
}
