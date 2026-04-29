const upload = document.getElementById("pdf-upload");

const container = document.getElementById("pdf-container");

let pdfDoc = null;

let scale = 1.4;

/* LOAD PDF */

upload.addEventListener("change", async (e)=>{

    const file = e.target.files[0];

    if(!file || file.type !== "application/pdf"){

        alert("Upload a valid PDF");

        return;
    }

    const reader = new FileReader();

    reader.onload = async function(){

        const typedArray = new Uint8Array(this.result);

        pdfDoc = await pdfjsLib
            .getDocument(typedArray)
            .promise;

        renderAllPages();
    };

    reader.readAsArrayBuffer(file);

});

/* RENDER ALL PAGES */

async function renderAllPages(){

    container.innerHTML = "";

    for(let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++){

        const page = await pdfDoc.getPage(pageNum);

        const viewport = page.getViewport({
            scale:scale
        });

        /* PAGE WRAPPER */

        const pageDiv = document.createElement("div");

        pageDiv.className = "page";

        /* CANVAS */

        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;

        canvas.height = viewport.height;

        pageDiv.appendChild(canvas);

        /* PAGE NUMBER */

        const pageNumber = document.createElement("div");

        pageNumber.className = "page-number";

        pageNumber.innerText = `Page ${pageNum}`;

        pageDiv.appendChild(pageNumber);

        /* APPEND PAGE */

        container.appendChild(pageDiv);

        /* RENDER PAGE */

        await page.render({
            canvasContext:ctx,
            viewport:viewport
        }).promise;
    }
}

/* ZOOM */

document
.getElementById("zoom-in")
.addEventListener("click",()=>{

    scale += 0.2;

    if(pdfDoc){

        renderAllPages();
    }
});

document
.getElementById("zoom-out")
.addEventListener("click",()=>{

    if(scale <= 0.4) return;

    scale -= 0.2;

    if(pdfDoc){

        renderAllPages();
    }
});

/* HORIZONTAL MOUSE WHEEL */

container.addEventListener("wheel", (e)=>{

    e.preventDefault();

    container.scrollLeft += e.deltaY;

}, { passive:false });
