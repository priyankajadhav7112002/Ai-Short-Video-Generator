import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import VideoDataProvider from "./_components/VideoDataProvider";

export default function DashboardLayout({ children }) {
  return (
    <VideoDataProvider>
      <div>
        {/* Sidebar */}
        <div className="hidden md:block h-screen bg-white fixed mt-[65px] w-64">
          <SideNav />
        </div>

        {/* Main Content */}
        <div>
          <Header />
          <div className="md:ml-64 p-10">{children}</div>
        </div>
      </div>
    </VideoDataProvider>
  );
}
