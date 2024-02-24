import { resourceUsage } from "process";


const imageMap = new Map<HTMLImageElement, string>()

export async function processImage(img: HTMLImageElement, skip = 1000) {
    if (!document.body.contains(img))  {
        imageMap.delete(img);
        return; 
    }
    if (img.hasAttribute('sl')) {
        return;
    }
    const source = img.src;
    const canvas = document.createElement('canvas');
    for (let i = 0; i < img.attributes.length; i++) {
        const attribute = img.attributes[i];
        canvas.setAttribute(attribute.name, attribute.value);
    }
    img.setAttribute('sl', '')
    const bounds = img.getBoundingClientRect();
    canvas.width = bounds.width || 1;
    canvas.height = bounds.height || 1;
    const ctx = canvas.getContext('2d');
    const parent = img.parentElement;
    parent.replaceChild(canvas, img);

    const loadedCanvas = await loadCanvas(source);

    const imageData = loadedCanvas.getContext('2d').getImageData(0, 0, loadedCanvas.width, loadedCanvas.height);
    const newImageData = new ImageData(imageData.width, imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {

        newImageData.data[i + 0] = imageData.data[i + 0];
        newImageData.data[i + 1] = imageData.data[i + 1];
        newImageData.data[i + 2] = imageData.data[i + 2];
        newImageData.data[i + 3] = imageData.data[i + 3];
        if (i % skip === 0) {
            await delay(1);
        }
        if (i === 0) {
            canvas.width = loadedCanvas.width;
            canvas.height = loadedCanvas.height;
        }
        ctx.putImageData(newImageData, 0, 0);
    }
    parent.replaceChild(img, canvas);
    img.setAttribute('orgSrc', img.src);
    img.src = canvas.toDataURL();
}



async function loadCanvas(source: string) {
    return new Promise<HTMLCanvasElement>((resolve,reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        const onLoad = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            resolve(canvas);
        }
        const onError = (error: ErrorEvent) => {
            reject(error);
        }
        const removeEventListeners = () => {
            image.removeEventListener('load', onLoad);
            image.removeEventListener('error', onError);
        }
        image.addEventListener('load', onLoad);
        image.addEventListener('error', onError);
        image.src = source;
    })
}

async function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}