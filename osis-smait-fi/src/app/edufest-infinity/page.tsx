'use client';

import dynamic from "next/dynamic";

const SceneIntro = dynamic(() => import("@/components/scenes/SceneIntro"), { ssr: false });
const SceneOne = dynamic(() => import("@/components/scenes/SceneOne"), { ssr: false });
const SceneAbout = dynamic(() => import("@/components/scenes/SceneAbout"), { ssr: false });
const SceneSelayang = dynamic(() => import("@/components/scenes/SceneSelayang"), { ssr: false });
const SceneInteractive = dynamic(() => import("@/components/scenes/SceneInteractive"), { ssr: false });
const EdufestFooter = dynamic(() => import("@/components/EdufestFooter"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full">
      <SceneIntro />
      <SceneOne />
      <SceneAbout />
      <SceneSelayang />
      <SceneInteractive />
      <EdufestFooter />
    </main>
  );
}
