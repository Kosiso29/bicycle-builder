import NextImage from "next/image";
import Header from "@/app/components/header";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { builderActions } from "@/app/store/builder";

export default function PaymentResult({ buildProcessState, setBuildProcessStage, totalPrice }: { buildProcessState: any, setBuildProcessStage: any, totalPrice: any }) {
    const [testState, setTestState] = useState(true);
    const dispatch = useDispatch();

    if (buildProcessState !== "result") {
        return null;
    }
    
    return (
        <div className="bg-[#F0EFEF] h-screen">
            <Header />
            <div className="flex justify-center h-[calc(100%-4rem)]">
                <div className="mt-32 w-96 text-center">
                    <div className="flex justify-center mb-4">
                        {
                            testState ? 
                                <NextImage src="/Success-Tick.svg" width={76} height={76} alt='' /> :
                                <NextImage src="/Failure-Tick.svg" width={76} height={76} alt='' />
                        }
                    </div>
                    <h1 className="text-2xl font-bold mb-4">
                        {
                            testState ? "Payment Successful" : "Payment Failed"
                        }
                    </h1>
                    <p className="mb-8">
                        {
                            testState ? 
                                `Payment of $${totalPrice} was successfully completed. Your order has been received and is being processed.` :
                                `The payment of $${totalPrice} was not successfully completed. Your order has been received and is being processed.`
                        }
                    </p>
                    <Button fullWidth variant="contained" onClick={() => { dispatch(builderActions.updateloadingScreen(true)); window.location.reload() }}>
                        {
                            testState ? "EXPLORE MORE BIKES" : "TRY AGAIN"
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}