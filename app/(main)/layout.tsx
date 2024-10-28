import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <div className="flex w-screen h-screen">
          <AppSidebar/>
          <div className="flex flex-col flex-1 h-full px-0 overflow-y-auto pt-0">
            <Navbar />
            <div className="flex-1 md:max-w-[screen] w-full p-0">
              {children}
            </div>
          </div>
      </div>
    </>
  );
}

export default MainLayout;