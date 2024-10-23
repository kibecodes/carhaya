"use client"

import DashboardCard from "@/components/dashboard/dashboard-card";
import { DollarSign, Users, CreditCard, Car  } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import SalesCard from "@/components/dashboard/sales-card";
import { Separator } from "@/components/ui/separator";

const OverviewPage = () => {
    return ( 
        <div className="flex flex-col gap-5 w-full">
            <h1 className="font-bold text-4xl pt-3">Dashboard</h1>

            <div className="flex flex-row gap-5 w-full">
                <DashboardCard
                    title={"Total Revenue"}
                    count={45000}
                    icon={<DollarSign />}
                />
                <DashboardCard
                    title={"Registered Users"}
                    count={2300}
                    icon={<Users />}
                />
                <DashboardCard
                    title={"Active rental vehicles"}
                    count={1200}
                    icon={<CreditCard />}
                />
                <DashboardCard
                    title={"Total fleet"}
                    count={3200}
                    icon={<Car />}
                />
            </div>

            <div className="flex flex-row space-x-2">
                <AnalyticsChart />
                <Separator orientation="vertical" />
                <SalesCard />
            </div>
        </div>
    );
}
 
export default OverviewPage;