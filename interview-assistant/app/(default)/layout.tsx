import "../css/style.css"; // Correctly point to the CSS file in the parent directory
import PageIllustration from "@/components/page-illustration";
import Footer from "@/components/ui/footer"; // Added Footer import

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex grow flex-col">
      <PageIllustration multiple />
      {children}
      <Footer /> {/* Added Footer component - will only appear in (default) layout routes */}
    </main>
  );
}