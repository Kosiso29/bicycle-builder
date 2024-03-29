// @ts-nocheck

import { useState } from "react";
import SelectionTemplate from "./selection-template";

export default function WheelSet({ parentProps, show, canvasContext, label, canvasX, canvasY, frameSetDimensions }) {
    const [actualWidth, setActualWidth] = useState("0");
    const updateDrawImageProps = (brand, model) => {

        const { models } = parentProps;

        const backWheetSet = models.filter(item => item.model === model && item.category === 'Back Wheel Set')[0]

        const image = document.getElementById('preview');
        const image2 = document.getElementById('preview2');

        const width = (frameSetDimensions?.width * actualWidth) / frameSetDimensions?.actualWidth;
        const height = image?.height * (width / image?.width);

        const x = frameSetDimensions.frontWheelSetX ? frameSetDimensions.frontWheelSetX : 550;
        const y = frameSetDimensions.frontWheelSetY ? frameSetDimensions.frontWheelSetY : 265;
        const x2 = frameSetDimensions.backWheelSetX ? frameSetDimensions.backWheelSetX : 45;
        const y2 = frameSetDimensions.backWheelSetY ? frameSetDimensions.backWheelSetY : 265;

        return {
            frontWheelSet: { image, x, y, width, height, globalCompositeOperation: 'destination-over', brand, model },
            backWheelSet: { image: image2, x: x2, y: y2, width, height, globalCompositeOperation: 'destination-over', brand: backWheetSet.brand, model: backWheetSet.model }
        }
    }

    if (/Group Set/i.test(label) && show) { 
        return <h1 className="text-4xl font-bold">{label}</h1>
    }

    return (
        <SelectionTemplate parentProps={parentProps} show={show} updateDrawImageProps={updateDrawImageProps} label={label} setActualWidth={setActualWidth} />
    )
}
