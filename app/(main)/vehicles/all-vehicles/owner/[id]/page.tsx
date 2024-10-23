import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { vehicles } from "@/data/vehicles";

interface OwnerProps {
    params: {
        id: string;
    }
}

const Owner = ({ params }: OwnerProps) => {
    const vehicle = vehicles.find((vehicle) => vehicle.id === params.id); 

    return (
         <div className="flex flex-col gap-5 pt-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/pages/vehicles">Vehicles</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Owner</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>{vehicle?.owner}</CardTitle>
                    <CardDescription>mail@example.com</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">Vehicle Details</p>
                    <p>{vehicle?.make}</p>
                    <p>{vehicle?.model}</p>
                    <div>Vehicle Images</div>
                    <p>Payment per Day: ${vehicle?.pricePerDay}</p>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col">
                        <p>Contact</p>
                        <p>mail@example.com</p>
                    </div>
                </CardFooter>
            </Card>

            <div></div>
        </div>
    );
}
 
export default Owner;