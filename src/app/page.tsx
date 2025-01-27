import Chat from "@/components/Chat";
import Footer from "@/components/ui/Footer";

export const runtime = "edge";

export default function Home() {
  return (
    <div className="overflow-x-hidden ">
      <Chat />
      <Footer />
    </div>
  );
}
