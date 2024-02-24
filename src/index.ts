import { processImage } from "./imageThing";

const observer = new MutationObserver(records => {
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < records.length; i++) {
        const nodeList = records[i].addedNodes;
        for (let j = 0; j < nodeList.length; j++) {
            const element = nodeList[j] as HTMLElement;
            if (element.tagName && element.tagName.toUpperCase() === 'IMG') {
                images.push(element as HTMLImageElement);
            }
        }
    }
    for (let i = 0; i < images.length; i++) {
        processImage(images[i]);
    }
});

observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
});
