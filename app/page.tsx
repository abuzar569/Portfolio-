"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <main>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
        <Navbar />
        <Hero ready={loaded} />
      </main>
    </SmoothScroll>
  );
}
