import ThemeToggler from "@/components/theme-toggler";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return ( 
        <div className="h-[100vh] flex items-center justify-center relative">
            {children}
            <div className="absolute top-5 right-0 text-black">
                <ThemeToggler />
            </div>
        </div>
    );
}

export default AuthLayout;