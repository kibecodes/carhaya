import BackButton from "@/components/back-btn";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";

const ErrorCard = () => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                Oops! Something went wrong
            </CardHeader>
            <CardFooter>
                <BackButton title="back to login" link="/auth/login"/>
            </CardFooter>
        </Card>
    )
}

export default ErrorCard;