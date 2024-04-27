import { Button } from "@mui/material";
import Loading from "@/app/components/loading";
import { useState } from "react";

export default function Presets({ parentProps }: { parentProps: any }) {
    const { models, setCanvasDrawImageProps, setRerender, frameSetDimensions, canvasDrawImageProps } = parentProps;
    const [loading, setLoading] = useState(0.5);

    const getPresetComponents = (preset: string) => {
        const filteredPresets = models.filter((item: any) => item?.[preset]);
        let loadedCount = 0;

        filteredPresets.forEach((item: any) => {
            const image = new Image();

            image.src = item.src;

            const canvasProp = item.category.split(" ").map((item: any, index: number) => index === 0 ? item.toLowerCase() : item).join("").replace("y", "i");

            image.onload = function () {
                const { actualWidth, brand, model, price } = item;
                const width = (frameSetDimensions?.width * actualWidth) / frameSetDimensions?.actualWidth;
                const height = image?.naturalHeight * (width / image?.naturalWidth);

                setCanvasDrawImageProps((prevState: any) => ({
                    ...prevState,
                    [canvasProp]: { ...prevState[canvasProp], image, image2: canvasProp === 'tire' ? image : undefined, width, height, brand, model, price, y: canvasProp === 'saddle' ? frameSetDimensions.saddleY - height : prevState[canvasProp].y, globalCompositeOperation: /tire|wheel/i.test(canvasProp) ? 'destination-over' : 'source-over' },
                }));

                loadedCount++;

                if (loadedCount === filteredPresets.length) {
                    setRerender((prevState: any) => !prevState);
                    setLoading(0.5);
                }
            };

        })
    }

    const presets = () => {
        return [
            { title: "Aerodynamics", buttonText: "build preset", onClick: () => { getPresetComponents("best_aerodynamics"); } },
            { title: "Lightweight", buttonText: "build preset", onClick: () => { getPresetComponents("best_lightweight"); } },
        ]
    }

    return (
        <div className="flex flex-col gap-5">
            <h1 className="font-bold text-2xl text-center">Presets</h1>
            {
                presets()?.map((item: any, index: number) => (
                    <div key={item.title}>
                        <p className="mb-2 text-center">{item.title}</p>
                        <div className="flex justify-center items-center">
                            <Button size="small" sx={{ "&:disabled": { cursor: "not-allowed", pointerEvents: "all !important" } }} disabled={!canvasDrawImageProps.frameSet.image || !canvasDrawImageProps.frameSet.brand} variant="contained" onClick={() => { setLoading(index); item.onClick() }}>{item.buttonText}</Button>
                        </div>
                        {loading === index ? <div className='self-center mt-2'><Loading small /></div> : null}
                    </div>
                ))
            }
        </div>
    )
}