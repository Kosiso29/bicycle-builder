// @ts-nocheck

import { useState, useEffect } from "react";
import { tire } from "../lib/apiData";
import SelectionTemplate from "./selection-template";

const TYRE_PROP = 'tire';

export default function Tire({ parentProps, show, canvasContext, canvasX, canvasY, frameSetDimensions }) {
    const [actualWidth, setActualWidth] = useState("0")
    const { setSelectionLevelProps } = parentProps;
    const updateDrawImageProps = (extraDrawImageProps) => {
        const x = frameSetDimensions.frontWheelSetX ? frameSetDimensions.frontWheelSetX - 11 : canvasX;
        const y = frameSetDimensions.frontWheelSetY ? frameSetDimensions.frontWheelSetY - 11 : canvasY;

        const x2 = frameSetDimensions.backWheelSetX ? frameSetDimensions.backWheelSetX - 11 : 35;
        const y2 = frameSetDimensions.backWheelSetY ? frameSetDimensions.backWheelSetY - 11 : canvasY;

        const image = document.getElementById('preview');

        const width = (frameSetDimensions?.width * actualWidth) / frameSetDimensions?.actualWidth;
        const height = image?.height * (width / image?.width);

        return { tire: { image, x, y, width, height, image2: image, x2, y2, width2: width, height2: height, globalCompositeOperation: 'destination-over', ...extraDrawImageProps } };
    }

    useEffect(() => {
        if (show) {
            setSelectionLevelProps([TYRE_PROP])
        }
    }, [setSelectionLevelProps, show])

    return (
        <SelectionTemplate parentProps={parentProps} show={show} updateDrawImageProps={updateDrawImageProps} dataSet={tire} label="Tyre" setActualWidth={setActualWidth} identifier={TYRE_PROP} />
    )
}
