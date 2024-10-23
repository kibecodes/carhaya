import { Card, CardContent, CardHeader } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    title: string;
    count: number;
    icon: React.ReactElement<LucideIcon>;
}

const DashboardCard = ({ title, count, icon }: DashboardCardProps) => {
    return ( 
        <Card className="p-0 pb-0 bg-white">
            <CardHeader className="flex flex-row justify-between gap-5 items-center">
                <h3 className="text-center">{title}</h3>
                {icon}
            </CardHeader>
            <div className="justify-center items-center">
                <CardContent>
                    <p className="text-2xl font-semibold">{count}</p>
                </CardContent>
            </div>
        </Card>
    );
}
 
export default DashboardCard;
