import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>{children}</main>
    </div>
  );
}
