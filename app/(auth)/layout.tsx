import ThemeToggler from "@/components/theme-toggler";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return ( 
        <div className="flex h-[100vh] w-screen justify-center items-center">
            {children}
            <div className="absolute top-5 right-0 text-black">
                <ThemeToggler />
            </div>
        </div>
    );
}

export default AuthLayout;