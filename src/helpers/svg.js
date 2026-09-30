import { 
    CHECKED_SVG_STRING, 
    CHEVRON_DOWN_STRING, 
    CHEVRON_UP_STRING, 
    NOTEBOOK_SVG_STRING, 
    TRASHCAN_STRING, 
    UNCHECKED_SVG_STRING 
} from "./svg-strings.js";

const renderSVG = function (svgString) {
    // Initialize the DOMParser
    const parser = new DOMParser();

    // Parse the string into an XML Document object
    const doc = parser.parseFromString(svgString, "image/svg+xml");

    // Extract the SVG element node
    const svgElement = doc.documentElement;

    return svgElement;
}

export const renderNotesSVG = function () {
    const notesSVG = renderSVG(NOTEBOOK_SVG_STRING);
    notesSVG.setAttribute("width", "40px");
    notesSVG.setAttribute("height", "40px");
    return notesSVG;
}

export const renderUncheckedSVG = function () {
    const uncheckedSVG = renderSVG(UNCHECKED_SVG_STRING);
    uncheckedSVG.setAttribute("width", "40px");
    uncheckedSVG.setAttribute("height", "40px");
    uncheckedSVG.style.pointerEvents = "none";
    return uncheckedSVG;
}

export const renderCheckedSVG = function () {
    const checkedSVG = renderSVG(CHECKED_SVG_STRING);
    checkedSVG.setAttribute("width", "40px");
    checkedSVG.setAttribute("height", "40px");
    checkedSVG.setAttribute("fill", "#4BB543");
    checkedSVG.style.pointerEvents = "none";
    return checkedSVG;
}

export const renderChevronDownSVG = function () {
    const chevronDownSVG = renderSVG(CHEVRON_DOWN_STRING);
    chevronDownSVG.setAttribute("width", "40px");
    chevronDownSVG.setAttribute("height", "40px");
    chevronDownSVG.style.pointerEvents = "none";
    return chevronDownSVG;
}

export const renderChevronUpSVG = function () {
    const chevronUpSVG = renderSVG(CHEVRON_UP_STRING);
    chevronUpSVG.setAttribute("width", "40px");
    chevronUpSVG.setAttribute("height", "40px");
    chevronUpSVG.style.pointerEvents = "none";
    return chevronUpSVG;
}

export const renderTrashcanSVG = function (width, height) {
    const trashcanSVG = renderSVG(TRASHCAN_STRING);
    trashcanSVG.setAttribute("width", width);
    trashcanSVG.setAttribute("height", height);
    trashcanSVG.style.pointerEvents = "none";
    return trashcanSVG;
}