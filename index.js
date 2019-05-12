const
    count = 20,
    durationTime = 3000 / count,
    margin = 40,
    recWidth = 40,
    width = count * recWidth + 100,
    height = 400;

let data = d3.shuffle(d3.range(1, count + 1)),
    array = [...data],
    sortedArray = [],
    i, j, min,
    steps = 0,
    state = false;

const svg = d3.select('.canvas').append("svg")
    .attr('width', width)
    .attr('height', height);
const x = d3.scaleLinear()
    .domain([0, count])
    .range([0, width]);

const rects = svg.selectAll("rect")
    .data(array)
    .enter()
    .append('rect');

rects.attr('id', d => "rect" + d)
    .attr('width', 40)
    .attr('height', d => d * 10)
    .attr('fill', 'blue')
    .attr('transform', (d, i) => `translate(${x(i)},30)`);

const labels = svg.selectAll("text")
    .data(array)
    .enter()
    .append('text');

labels.attr('id', d => "text" + d)
    .attr('fill', 'black')
    .attr('transform', (d, i) => `translate(${x(i) + recWidth / 3},20)`)
    .text(d => d);

const sort = () => {
    for (i = 0; i < length - 1; i++) {
        let min = i;
        for (j = i + 1; j < length; j++) {
            if (sortedArray[j] < sortedArray[min]) {
                min = j;
            }
        }

        if (min != i) {
            let temp = sortedArray[min];
            sortedArray[min] = sortedArray[i];
            sortedArray[i] = temp;
        }
    }
    console.log(sortedArray);
}
const activeStep = (step) => {
    document.querySelectorAll("ul li").forEach(element => {
        element.className = "";
    });
    document.querySelector(`ul li:nth-child(${step})`).className = "working";
}
const stop = (e) => {
    e.nextElementSibling.style.display = 'inline-block';
    state = true;
}
const reset = (e) => {
    e.style.display = 'none';
    array = [...data];
    sortedArray = [];
    state = false;

    rects.attr("class", "")
        .attr('transform', (d, i) => `translate(${x(i)},30)`);
    labels.attr("class", "")
        .attr('transform', (d, i) => `translate(${x(i) + recWidth / 3},20)`);
}
const selectionSort = () => {
    activeStep(2);
    i = 0;
    min = count;
    let minIndex;
    rects.attr("class", "");
    const findMin = () => {
        activeStep(3);
        if (state) return state = false;
        if (i <= array.length) {
            d3.select("#rect" + array[i]).attr("class", "select");
            d3.timeout(() => {
                d3.select("#rect" + array[i]).attr("class", "");
                if (array[i] < min) {
                    activeStep(4);
                    d3.select("#rect" + array[i]).attr("class", "min");
                    d3.select("#rect" + min).attr("class", "");
                    min = array[i];
                    minIndex = i;
                }
                i++;
                d3.timeout(() => findMin(), durationTime);
            }, durationTime);
        }
        else {
            activeStep(5);
            sortedArray.push(min);
            array.splice(minIndex, 1);

            rects.transition().duration(500)
                .attr("transform", d => `translate(${
                    x(sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : array.indexOf(d) + sortedArray.length)
                    },30)`);
            labels.classed("sorted", d => sortedArray.indexOf(d) > -1)
                .transition().duration(durationTime * 4)
                .attr("transform", d => `translate(${
                    x(sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : array.indexOf(d) + sortedArray.length) + recWidth / 3
                    },20)`);
            rects.attr("class", "");

            d3.timeout(() => {
                if (array.length > 0) selectionSort();
                else activeStep(6);
            }, durationTime);
            return;
        }
    }
    findMin();
}