import { Card, CardHeader } from "@/components/ui/card";

const UnauthorizedCard = () => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                Unauthorized! 
            </CardHeader>
        </Card>
    )
}

export default UnauthorizedCard;