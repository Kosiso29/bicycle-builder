/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { RotateLeft as RotateLeftIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Link from "next/link";
import SelectionTabs from "./selection-tabs";
import SummaryList from "@/app/components/summary-list";
import FrameSet from "./frame-set";
import GroupSet from "./group-set";
import WheelSet from "./wheel-set";
import Stem from "./stem";
import HandleBar from "./handle-bar";
import Saddle from "./saddle";
import Tire from "./tire";
import Presets from "./presets";
import Tooltips from "./tooltips";
import { CurrencyFormatter } from "@/app/utils/currency-formatter";
import { positionCanvasImages } from "@/app/utils/position-canvas-images";

export default function BikeBuilder({
    canvasDrawImageProps, setCanvasDrawImageProps, setCanvasImage, showSummary, setShowSummary,
    frameSetDimensions, setFrameSetDimensions, models, presets, modelsPresets, setResetComponent, stemDimensions, setStemDimensions,
    handleBarDimensions, setHandleBarDimensions
}) {
    const [selectionLevel, setSelectionLevel] = useState(1);
    const [selectionLevelProps, setSelectionLevelProps] = useState([]);
    const [canvasSelectionLevelState, setCanvasSelectionLevelState] = useState(1);
    const [rerender, setRerender] = useState(false);
    const [canvasContext, setCanvasContext] = useState(null);
    const [initialCanvasDrawImageProps, setInitialCanvasDrawImageProps] = useState(canvasDrawImageProps);
    const [totalPrice, setTotalPrice] = useState(null);
    const [tooltips, setTooltips] = useState({
        key_metrics: "---",
        aerodynamics: "---",
        weight: "---",
        comfort: "---",
        stiffness: "---",
        overall: "---"
    });
    // selectionPresetProps sets the selection template with brand and model after preset selection is made
    const [selectionPresetProps, setSelectionPresetProps] = useState({
        frontWheelSet: {},
        stem: {},
        handleBar: {},
        saddle: {},
        tire: {},
    });

    const parentProps = {
        setRerender,
        setCanvasDrawImageProps,
        setSelectionLevelProps,
        models,
        selectionLevelProps,
        setStemDimensions,
        setTooltips,
        frameSetDimensions,
        canvasDrawImageProps,
        setCanvasSelectionLevelState,
        selectionPresetProps,
        setSelectionPresetProps,
        setSelectionLevel,
        setShowSummary,
        initialCanvasDrawImageProps,
        stemDimensions,
        handleBarDimensions,
        setHandleBarDimensions
    }

    const canvasNumberData = [
        { text: "1.", x: 500, y: 150 },
        { text: "2.", x: 500, y: 520 },
        { text: "3.", x: 800, y: 450 },
        { text: "4.", x: 680, y: 110 },
        { text: "5.", x: 200, y: 80 },
        { text: "6.", x: 80, y: 250 },
    ]

    const canvasPlaceholderImages = {
        frameSet: { image: "/PH-Specialized_Allez_Sprint_final.png", x: 200, y: 100, width: 528, height: 374.8259385665529, globalCompositeOperation: 'destination-over' },
        frontWheelSet: { image: "/PH-ENVE_SES_4.5_F-final.png", x: 553, y: 258, width: 331.73333333333335, height: 331.73333333333335, globalCompositeOperation: 'destination-over' },
        backWheelSet: { image: "/PH-ENVE_SES_4.5_R-final.png", x: 48, y: 258, width: 331.73333333333335, height: 331.73333333333335, globalCompositeOperation: 'destination-over' },
        stem: { image: "/PH-CADEX-Aero_Integrated_Handlebar.png", x: 603, y: 142, width: 125.33333333333333, height: 87.16916740217711, globalCompositeOperation: 'destination-over', hasHandleBar: true, groupSet_shifterX: 93, groupSet_shifterY: 74 },
        handleBar: { image: "/PH-Cadex-Race-final.png", x: 638, y: 169, width: 80, height: 85.58692421991084, stemHandleBarX: 38, stemHandleBarY: 2, globalCompositeOperation: 'destination-over' },
        saddle: { image: "/PH-ENVE_X_SELLE_ITALIA_BOOST_SLR.png", x: 258, y: 86.65583333333333, width: 116.26666666666667, height: 23.344166666666666, globalCompositeOperation: 'destination-over' },
        tire: { image: "/PH-Tan_SES31_FullWheel-modified.png", x: 541, y: 247, width: 353.06666666666666, height: 353.06666666666666, x2: 36, y2: 247, width2: 353.06666666666666, height2: 353.06666666666666, globalCompositeOperation: 'destination-over' },
        // drivetrain actualWidth used is 622mm instead of 722mm
        groupSet_drivetrain: { image: "/Groupset-Drivetrain.png", x: 185, y: 380, width: 331.733333333, height: 136.6176524785, globalCompositeOperation: 'destination-over' },
        groupSet_shifter: { image: "/Groupset-Shifter.png", x: 701, y: 121.859649118, width: 80, height: 96.140350882, stemShifterX: 98, stemShifterY: 76, handleBarShifterX: 50, handleBarShifterY: 70, globalCompositeOperation: 'destination-over' },
    }

    function setImage(doNotRenderCanvasNumbers = false, doNotIncrementCanvasSelectionLevelState = false) {
        const canvasDrawImagePropsOrderArray = ['frameSet', 'groupSet_drivetrain', 'frontWheelSet', 'backWheelSet', 'stem', 'groupSet_shifter', 'handleBar', 'saddle', 'tire'];

        const newCanvasDrawImageProps = {};
        
        canvasDrawImagePropsOrderArray.forEach(key => {
            if (canvasDrawImageProps.hasOwnProperty(key)) {
              newCanvasDrawImageProps[key] = canvasDrawImageProps[key];
            }
        })

        if (canvasContext) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        console.log('canvasDrawImageProps', newCanvasDrawImageProps);
        Object.entries(newCanvasDrawImageProps).forEach((drawImageProps) => {
            if (drawImageProps[0] === "stem" && frameSetDimensions.hasStem) {
                return
            }
            if (drawImageProps[0] === "handleBar" && (frameSetDimensions.hasHandleBar || !canvasDrawImageProps.stem.image || stemDimensions.hasHandleBar)) {
                return
            }
            if (doNotRenderCanvasNumbers && !drawImageProps.brand) {
                return;
            }
            if (drawImageProps[1].image) {
                const { image, multipleImages, x, y, width, height, globalCompositeOperation } = drawImageProps[1];

                canvasContext.globalCompositeOperation = globalCompositeOperation;

                if (!doNotRenderCanvasNumbers) {
                    const canvasDrawImagePropsArray = ['frameSet', 'groupSet_drivetrain', 'frontWheelSet', 'stem', 'saddle', 'tire'];

                    canvasContext.font = "1.5rem Arial"
                    canvasNumberData.forEach((canvasNumber, index) => {
                        if (canvasDrawImageProps[canvasDrawImagePropsArray[index]]?.brand) {
                            // canvasContext.beginPath();
                            // canvasContext.arc(canvasNumber.x, canvasNumber.y, 20, 0, 2 * Math.PI, false);
                            canvasContext.fillStyle = 'blue';
                            // canvasContext.fill();
                            // canvasContext.fillStyle = "white";
                            // canvasContext.textAlign = "center";
                            // canvasContext.textBaseline = "middle";
                        } else {
                            canvasContext.fillStyle = "black";
                        }
                        canvasContext.fillText(canvasNumber.text, canvasNumber.x, canvasNumber.y);
                    });
                }


                if (multipleImages) {
                    multipleImages.forEach(imageItem => {
                        canvasContext.globalCompositeOperation = imageItem.globalCompositeOperation
                        canvasContext.drawImage(imageItem.image, x, y, width, height);
                    })
                } else {
                    canvasContext.drawImage(image, x, y, width, height);
                }
                if (drawImageProps[1].image2) {
                    const { image2, x2, y2, width2, height2 } = drawImageProps[1];

                    canvasContext.drawImage(image2, x2, y2, width2, height2);
                }
            }
        })

        if (!doNotIncrementCanvasSelectionLevelState) {
            setCanvasSelectionLevelState(prevState => {
                if (prevState === selectionLevel) prevState++;
                return prevState;
            });
        }
    }

    const updateSelectionLevel = (newSelectionLevel) => {
        if (canvasSelectionLevelState > 1) {
            if (canvasSelectionLevelState > (newSelectionLevel - 1)) {
                setSelectionLevel(newSelectionLevel);
            } else if (newSelectionLevel === 2 || newSelectionLevel === 3) {
                setSelectionLevel(newSelectionLevel);
                if (newSelectionLevel > canvasSelectionLevelState) {
                    setCanvasSelectionLevelState(newSelectionLevel);
                }
            } else {
                toast.error("Please either skip or complete selection before proceeding");
            }
        } else {
            toast.error("Frame Set must be selected to proceed");
        }
    }

    const handleCanvasEvents = (e, callback) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = 20;
        const height = 30;

        for (const [index, item] of Object.entries(canvasNumberData)) {
            if (x >= (item.x * 0.9) && x <= (item.x * 0.9) + width && y >= ((item.y - 25) * 0.9) && y <= ((item.y - 25) * 0.9) + height) {
                callback(index);
                break;
            }
        }
    }

    const handleCanvasClick = (e) => {
        handleCanvasEvents(e, (index) => {
            if (Number(index) + 1 === 4 && (frameSetDimensions.hasStem)) {
                return;
            }
            updateSelectionLevel(Number(index) + 1);
        })
    }

    const handleCanvasHover = (e) => {
        let imageHovered = false;

        handleCanvasEvents(e, () => imageHovered = true)

        if (imageHovered) {
            e.target.style.cursor = 'pointer';
        } else {
            e.target.style.cursor = 'default';
        }
    }

    const getCanvasContext = () => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        return context;
    }

    const hasParts = (selectionLevel) => {
        if (selectionLevel === 4 && frameSetDimensions.hasHandleBar) {
            return true;
        }
        return false;
    }

    const autoSkipExistingPartsSelection = (currentSelectionLevel, selectionButtonText) => {
        if (hasParts(currentSelectionLevel) && /Next|Skip/i.test(selectionButtonText)) {
            currentSelectionLevel++;
            if (currentSelectionLevel > canvasSelectionLevelState) {
                setCanvasSelectionLevelState(currentSelectionLevel);
            };
            return autoSkipExistingPartsSelection(currentSelectionLevel, selectionButtonText);
        }
        if (hasParts(currentSelectionLevel) && /Prev/i.test(selectionButtonText)) {
            currentSelectionLevel--;
            return autoSkipExistingPartsSelection(currentSelectionLevel, selectionButtonText);
        }
        return currentSelectionLevel;
    }

    const handleSelectionLevel = (e) => {
        let newSelectionLevel = selectionLevel;
        if (/Prev/i.test(e.target.textContent)) {
            if (selectionLevel > 1) {
                newSelectionLevel--;
                newSelectionLevel = autoSkipExistingPartsSelection(newSelectionLevel, e.target.textContent);
            } else {
                toast.info("You're at the beginning");
            }
        }

        if (/Next/i.test(e.target.textContent)) {
            if (canvasSelectionLevelState > 1) {
                if (canvasSelectionLevelState > selectionLevel) {
                    newSelectionLevel++;
                    newSelectionLevel = autoSkipExistingPartsSelection(newSelectionLevel, e.target.textContent);
                } else if (selectionLevel === 2) {
                    newSelectionLevel++;
                    if (newSelectionLevel > canvasSelectionLevelState) {
                        setCanvasSelectionLevelState(newSelectionLevel);
                    }
                } else {
                    toast.error("Please either skip or complete selection before proceeding");
                }
            } else {
                toast.error("Frame Set must be selected to proceed");
            }
        }

        if (/Skip/i.test(e.target.textContent)) {
            newSelectionLevel++;
            newSelectionLevel = autoSkipExistingPartsSelection(newSelectionLevel, e.target.textContent);
            if (newSelectionLevel > canvasSelectionLevelState) {
                setCanvasSelectionLevelState(newSelectionLevel);
            }
        }


        setSelectionLevel(newSelectionLevel)
    };

    const handleReset = () => {
        setCanvasDrawImageProps({
            frameSet: {},
            frontWheelSet: {},
            backWheelSet: {},
            stem: {},
            handleBar: {},
            saddle: {},
            tire: {},
        });
        setSelectionLevel(1);
        setCanvasSelectionLevelState(1);
        setFrameSetDimensions({});
        setStemDimensions({ hasHandleBar: true });
        setResetComponent(prevState => prevState + 1);
        setShowSummary(false);
    }

    const updateCanvasPlaceholderImageDimensions = (filteredModelPlaceholders, image, componentKey, componentData) => {
        const filteredComponentData = filteredModelPlaceholders.filter(item => {
            const canvasProp = item.category.split(" ").map((item: any, index: number) => index === 0 ? item.toLowerCase() : item).join("").replace("y", "i");
            return canvasProp === componentKey;
        })

        if (filteredComponentData.length > 0) {
            const width = (528 * filteredComponentData[0].actualWidth) / 990;
            const height = image?.height * (width / image?.width);
            componentData.width = width;
            componentData.height = height;
            // TODO: Fix wheelset bug and enable autopositioning of placeholders.
            // positionCanvasImages(filteredComponentData[0], componentKey, canvasPlaceholderImages, setCanvasDrawImageProps, frameSetDimensions, stemDimensions)
        }

    }

    const renderCanvasPlaceholderImages = () => {
        let loadedCount = 0;

        setCanvasDrawImageProps(canvasPlaceholderImages);

        const filteredModelPlaceholders = models.filter(item => {
            switch (item.category + " - " + item.model) {
                case "Frame Set - Allez Sprint":
                    return true;
                case "Group Set - Drivetrain - Dura-Ace DI2":
                    return true;
                case "Front Wheel Set - SES 4.5":
                    return true;
                case "Back Wheel Set - SES 4.5":
                    return true;
                case "Stem - Aero Integrated Handlebar":
                    return true;
                case "Handle Bar - Race":
                    return true;
                case "Saddle - ENVE X Selle Italia Boost SLR":
                    return true;
                case "Tyre - SES Road":
                    return true;
                default:
                    break;
            }
        });

        Object.entries(canvasPlaceholderImages).forEach(entries => {
            const image = new Image();

            image.src = entries[1].image;
            image.crossOrigin = "anonymous";
            image.onload = function () {
                updateCanvasPlaceholderImageDimensions(filteredModelPlaceholders, image, entries[0], entries[1]);
                setCanvasDrawImageProps(prevState => ({ ...prevState, [entries[0]]: { ...entries[1], image, image2: entries[0] === 'tire' ? image : null } }))
                setInitialCanvasDrawImageProps(prevState => ({ ...prevState, [entries[0]]: { ...entries[1], image, image2: entries[0] === 'tire' ? image : null } }))

                loadedCount++;

                if (loadedCount === Object.values(canvasPlaceholderImages).length) {
                    setFrameSetDimensions({ actualWidth: 990, width: 528 });
                    setRerender(prevState => !prevState);
                }
            };
        });
    }

    const handleSummary = () => {
        setImage(true, true);
        const canvas = document.getElementById('canvas');
        setCanvasImage(canvas.toDataURL());
        setImage(false, true);
        setShowSummary(true);
    }

    const handleBarStemConditions = !stemDimensions.hasHandleBar && (canvasDrawImageProps.stem.image && canvasDrawImageProps.stem.model) && !frameSetDimensions.hasHandleBar;

    useEffect(() => {
        const context = getCanvasContext();
        setCanvasContext(context);
    }, []);

    useEffect(() => {
        if (canvasContext) {
            renderCanvasPlaceholderImages();
        }
    }, [canvasContext]);

    useEffect(() => {
        if (selectionLevel < 7) {
            setShowSummary(false);
        }
    }, [selectionLevel]);

    useEffect(() => {
        // reset handlebar props when there's no handlebar
        if ((!canvasDrawImageProps.stem.model && canvasDrawImageProps.handleBar.model && !frameSetDimensions.hasStem)) {
            setCanvasDrawImageProps(prevState => ({
                ...prevState,
                handleBar: { ...initialCanvasDrawImageProps.handleBar, x: prevState.handleBar.x, y: prevState.handlbeBar.y },
                groupSet_shifter: { ...initialCanvasDrawImageProps.groupSet_shifter, x: prevState.groupSet_shifter.x, y: prevState.groupSet_shifter.y },
            }));
            setRerender(prevState => !prevState);
        }
        if (Object.keys(frameSetDimensions).length > 0) {
            if (canvasSelectionLevelState === 1 && !canvasDrawImageProps.frameSet.model) {
                setImage(false, true);
            } else {
                setImage();
                setTotalPrice(Object.values(canvasDrawImageProps).reduce((acc, item) => {
                    if (item.price) {
                        acc = (parseFloat(acc) + parseFloat(item.price)).toFixed(2);
                    }
                    return acc;
                }, 0));
            }
        }
    }, [rerender]);

    return (
        <div>
            <div className="flex flex-col mr-[22rem] h-screen bg-blue-100 w-[calc(100% - 22rem)] overflow-auto">
                <div className="flex items-stretch">
                    <div className="flex flex-col justify-between bg-gray-100 w-40 border border-black py-5 px-2">
                        <Presets parentProps={parentProps} setFrameSetDimensions={setFrameSetDimensions} presets={presets} modelsPresets={modelsPresets} />
                        <div className="flex justify-center">
                            <Link href="/" className="block mt-5">
                                <Button size="small" variant="outlined">Exit Builder</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="h-[calc(100vh-9rem)] min-h-[560px] max-h-[620px] w-[calc(((100vh-9rem)*900)/620)] min-w-[810px] max-w-[900px] overflow-hidden flex justify-center items-center ml-auto mr-auto">
                        <canvas id="canvas" className="scale-90" onMouseMove={handleCanvasHover} onClick={handleCanvasClick} width={950} height={680} />
                    </div>
                </div>
                <Tooltips tooltips={tooltips} canvasDrawImageProps={canvasDrawImageProps} />
            </div>
            <div id="selection" className="flex flex-col gap-10 fixed right-0 top-0 h-screen w-[22rem] border-l-8 bg-gray-100 border-gray-400 p-5 pb-0 overflow-auto">
                <div>
                    {
                        showSummary ?
                            <>
                                <div className="flex justify-between pb-3">
                                    <Button size="small" variant="outlined" onClick={() => { setShowSummary(false); setSelectionLevel(prevState => prevState - 1) }}>Back</Button>
                                    <Button size="small" variant="contained">Proceed</Button>
                                </div>
                                <Button size="small" fullWidth variant="outlined">Add to Favourites</Button>
                            </> :
                            <>
                                <div className="flex justify-between py-2">
                                    <Button size="small" variant="outlined" sx={{ "&:disabled": { cursor: "not-allowed", pointerEvents: "all !important" } }} disabled={selectionLevel === 1} onClick={handleSelectionLevel}>Prev</Button>
                                    <Button size="small" variant="text" sx={{ "&:disabled": { cursor: "not-allowed", pointerEvents: "all !important" } }} disabled={canvasSelectionLevelState > selectionLevel || selectionLevel === 6 || selectionLevel === 1 ? true : false} onClick={handleSelectionLevel}>Skip</Button>
                                    {
                                        selectionLevel < 6 ?
                                            <Button size="small" variant="contained" sx={{ "&:disabled": { cursor: "not-allowed", pointerEvents: "all !important" } }} onClick={handleSelectionLevel} disabled={canvasSelectionLevelState === 1 || (canvasSelectionLevelState <= selectionLevel && selectionLevel !== 2)}>Next</Button> :
                                            <Button size="small" variant="contained" onClick={() => { setSelectionLevel(prevState => prevState + 1); setShowSummary(true); }}>Summary</Button>
                                    }
                                </div>
                            </>
                    }
                    <div className="mt-2">
                        <SelectionTabs indexArray={frameSetDimensions.hasStem && frameSetDimensions.hasHandleBar ? [1, 2, 3, 5, 6] : [1, 2, 3, 4, 5, 6]} value={selectionLevel} updateSelectionLevel={updateSelectionLevel} canvasSelectionLevelState={canvasSelectionLevelState} setCanvasSelectionLevelState={setCanvasSelectionLevelState} toast={toast} />
                    </div>
                </div>
                <FrameSet parentProps={parentProps} handleReset={handleReset} show={selectionLevel === 1} setFrameSetDimensions={setFrameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} />
                <GroupSet parentProps={parentProps} canvasContext={canvasContext} show={selectionLevel === 2} canvasX={550} canvasY={265} frameSetDimensions={frameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} label="Groupset" />
                <WheelSet parentProps={parentProps} canvasContext={canvasContext} show={selectionLevel === 3} canvasX={45} canvasY={265} frameSetDimensions={frameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} label="Front Wheel Set" />
                <Stem parentProps={parentProps} canvasContext={canvasContext} show={selectionLevel === 4 && !frameSetDimensions.hasStem} canvasX={600} canvasY={150} frameSetDimensions={frameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} />
                <HandleBar parentProps={parentProps} canvasContext={canvasContext} show={selectionLevel === 4 && (handleBarStemConditions || frameSetDimensions.hasStem)} canvasX={635} canvasY={157} frameSetDimensions={frameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} />
                <Saddle parentProps={parentProps} canvasContext={canvasContext} show={selectionLevel === 5} canvasX={240} canvasY={110} frameSetDimensions={frameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} />
                <Tire parentProps={parentProps} canvasContext={canvasContext} show={selectionLevel === 6} canvasX={540} canvasY={254} frameSetDimensions={frameSetDimensions} setCanvasDrawImageProps={setCanvasDrawImageProps} />
                {
                    showSummary ?
                        <SummaryList canvasDrawImageProps={canvasDrawImageProps} frameSetDimensions={frameSetDimensions} small /> : null
                }
                <div className="flex flex-col justify-self-end mt-auto shadow-[0_-13px_16px_-16px_rgba(0,0,0,0.3)] gap-3 sticky border-gray-400 w-full bg-gray-100 bottom-0 pb-5 pt-2 z-50">
                    <div className='flex justify-between items-center'>
                        <h1 className={`font-bold text-xl basis-[50%]`}>Total:</h1>
                        <p className={`basis-[50%] text-primary text-md font-bold`}>{totalPrice !== null ? CurrencyFormatter(totalPrice) : "---"}</p>
                        <RotateLeftIcon color="error" fontSize="large" onClick={handleReset} className="cursor-pointer self-end" />
                    </div>
                </div>
            </div>
        </div>

    );
}
