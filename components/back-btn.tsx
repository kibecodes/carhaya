import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

interface ButtonProps {
    title: string;
    link: string;
}

const BackButton = ({ title, link }: ButtonProps) => {
    return ( 
        <Link href={link} className="flex flex-row gap-1 hover:underline">
            <IoMdArrowRoundBack size={24}/> {title}
        </Link> 
    );
}
 
export default BackButton;