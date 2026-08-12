import SceneIntro from "@/components/scenes/SceneIntro";
import SceneOne from "@/components/scenes/SceneOne";
import SceneAbout from "@/components/scenes/SceneAbout";
import SceneSelayang from "@/components/scenes/SceneSelayang";
import SceneInteractive from "@/components/scenes/SceneInteractive";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full">

      <SceneIntro />
      <SceneOne />
      <SceneAbout />
      <SceneSelayang />
      <SceneInteractive />
      <Footer />

    </main>
  );
}
