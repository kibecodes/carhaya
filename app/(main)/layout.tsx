import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex w-screen h-screen p-5 gap-5">
        <div className="hidden md:block w-[250px] h-full overflow-y-auto flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex flex-col w-full h-full overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-0 md:max-w-[1140px]">
            {children}
          </div>
        </div>
      </div>
    </>

  );
}

export default MainLayout;