const random = (min, max, limit = max) => {
    let data = [];
    for (let i = 0; i < limit; i++) {
        data.push(Math.floor(Math.random() * (max - min)) + min);
    }
    return data;
}
const linear = (input,
    inputLow = 0,
    inputHigh = 20,
    outputLow = 0,
    outputHigh = 1000) => {
    return ((input - inputLow) / (inputHigh - inputLow)) *
        (outputHigh - outputLow) + outputLow;
}
const generateRects = (data) => {
    for (let i = 0; i < data.length; i++) {
        const rect = document.createElement("div");
        rect.setAttribute("id", "rect" + data[i]);
        rect.style.height = (data[i] * 10) + "px";
        rect.style.width = recWidth + "px";
        rect.style.transform = `translate(${linear(i)}px,30px)`;
        rects.appendChild(rect);

        const label = document.createElement("span");
        label.textContent = data[i];
        label.setAttribute("id", "label" + data[i]);
        label.style.width = recWidth + "px";
        label.style.transform = `translate(${linear(i)}px,10px)`;
        labels.appendChild(label);
    }
}
const activeStep = (step) => {
    document.querySelectorAll("ul li span").forEach(element => {
        element.className = "";
    });
    document.querySelector(`ul li:nth-child(${step}) span`).className = "step";
}
const stop = (e) => {
    stopState = true;
    e.nextElementSibling.style.display = "inline-block";
}
const reset = (e) => {
    array = [...unSortedArray];
    sortedArray = [];
    stopState = false;
    i = 0;
    rects.querySelectorAll("div").forEach(rect => {
        rect.className = "";
        rect.style.transform = `translate(${linear(i)}px,30px)`;
        i++;
    });
    i = 0;
    labels.querySelectorAll("span").forEach(label => {
        label.className = "";
        label.style.transform = `translate(${linear(i)}px,10px)`;
        i++;
    });
    e.style.display = "none";
}
const selectionSort = () => {
    activeStep(2);
    i = 0;
    min = array[i];
    let minIndex = 0;
    const findMin = () => {
        activeStep(3);
        if (stopState) return stopState = false;
        if (i < array.length) {
            rects.querySelector("#rect" + array[i]).className = "select";
            setTimeout(() => {
                if (i != 0) rects.querySelector("#rect" + array[i]).className = "";
                if (array[i] < min) {
                    activeStep(4);
                    rects.querySelector("#rect" + min).className = "";
                    min = array[i];
                    rects.querySelector("#rect" + min).className = "min";
                    minIndex = i;
                }
                else if (array[i] == min) {
                    rects.querySelector("#rect" + array[i]).className = "min";
                }
                i++;
                setTimeout(() => { findMin(); }, timeout);
            }, timeout);
        }
        else {
            activeStep(5);
            sortedArray.push(min);
            array.splice(minIndex, 1);
            rects.querySelectorAll("div").forEach(rect => {
                const d = parseInt(rect.getAttribute("id").slice(4));
                rect.style.transition = "transform 1s";
                const coor = {
                    x: linear(sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : array.indexOf(d) + sortedArray.length),
                    y: "30"
                }
                rect.style.transform = `translate(${coor.x}px,${coor.y}px)`;
                rect.className = sortedArray.indexOf(d) > -1 ? "sorted" : "";
            });

            labels.querySelectorAll("span").forEach(label => {
                const d = parseInt(label.getAttribute("id").slice(5));
                label.style.transition = "transform 1s";
                const coor = {
                    x: linear(sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : array.indexOf(d) + sortedArray.length),
                    y: "10"
                }
                label.style.transform = `translate(${coor.x}px,${coor.y}px)`;
            });

            setTimeout(() => {
                if (array.length > 0) selectionSort();
                else activeStep(6);
            }, timeout);
            return;
        }
    }
    findMin();
}
let min = 1;
const count = 20,
    max = 30,
    data = random(min, max, count);
let unSortedArray = [];
data.forEach((value) => {
    if (!(unSortedArray.indexOf(value) > -1))
        unSortedArray.push(value);
});
const length = unSortedArray.length,
    timeout = 2000 / length,
    recWidth = 40,
    width = length * recWidth + 100,
    height = 400;
let sortedArray = [],
    array = [...unSortedArray],
    i, stopState = false;

const rects = document.querySelector(".rects");
const labels = document.querySelector(".labels");
generateRects(array);