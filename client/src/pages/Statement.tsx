import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatementPage from "@/components/StatementPage";
import Footer from "@/components/Footer";

export default function Statement() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/", testId: "link-bc-home" },
              { label: "Statement", testId: "text-bc-current" }
            ]}
          />
        </div>
        <StatementPage portraitPosition="left" />
      </main>
      <Footer />
    </div>
  );
}
