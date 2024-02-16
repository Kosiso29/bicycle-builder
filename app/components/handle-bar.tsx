// @ts-nocheck

import { useState } from "react";
import { handleBar } from "../lib/apiData";
import SelectionTemplate from "./selection-template";

export default function HandleBar({ parentProps, show, canvasContext, canvasX, canvasY, frameSetDimensions }) {
    const [ actualWidth, setActualWidth ] = useState("0")
    const updateDrawImageProps = () => {
        const x = canvasX;
        const y = canvasY;

        const image = document.getElementById('preview');

        const width = (frameSetDimensions?.width * actualWidth) / frameSetDimensions?.actualWidth;
        const height = image?.height * (width / image?.width);
        
        return { handleBar: { image, x, y, width, height, globalCompositeOperation: 'source-over' } };
    }

    return (
        <SelectionTemplate parentProps={parentProps} show={show} updateDrawImageProps={updateDrawImageProps} dataSet={handleBar} label="Handle Bar" setActualWidth={setActualWidth} />
    )
}