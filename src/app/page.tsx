import { Hero, Manifest, SystemArchitecture, Principles, Vision, Contact } from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="divider" />
      <Manifest />
      <div className="divider" />
      <SystemArchitecture />
      <div className="divider" />
      <Principles />
      <div className="divider" />
      <Vision />
      <div className="divider" />
      <Contact />
    </main>
  );
}
