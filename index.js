// === GLOBALS ===

/** Where to pull data from (in this case, Mark's quizlet. */
const QUIZLET_URL = "./quizlet_page.html";

/** Data about each answer type */
const ANSWER_TYPES = {
    1: {name: "Aura", color: "#4a851b", particle: "an"},
    2: {name: "Elemental", color: "#aa8500", particle: "an"},
    3: {name: "Enchanter", color: "#8632aa", particle: "an"},
    4: {name: "Transformer", color: "#aa2000", particle: "a"}
};

/** Stores the user's answers, a map of question numbers to a set of answers. */
let answers = new Map();

/**
 * interface Question {
 *     text: string       // The actual text of the question
 *     answers: string[]  // The possible choices
 *     mapping: number[]  // The answer type each answer maps to.
 * }
 */

/** Data pulled from Mark's quizlet. Is an array of Question objects. */
let data = [];

// === UTILITY ===

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Finds the index containg the array's maximum value, or -1 if not found.
 */
function getMaxValue(array) {
    let maxValue = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > maxValue) {
            maxValue = array[i];
        }
    }

    return maxValue;
}

/**
 * Clears all children of a node.
 * @param node {Node}
 */
function clearChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

// === QUIZLET PARSING ===

/**
 * Parses a definition from Quizlet. Definitions take the format:
 * a) Type<br>b) Type<br>c) Type
 * where Type is an answer type as seen above.
 *
 * @param def {HTMLElement} The HTML element containing the definition.
 * @return {number[]} The mappings in order.
 */
function parseDefs(def) {
    let text = def.innerHTML;

    return text.split("<br>").map((s) => parseInt(s.substr(s.search(/\d+/)).trim()));
}

/**
 * Parses a term from Quizlet. Terms take the format:
 * Description<br>Description<br>a) Possible Answer<br>b) Possible Answer<br>c) Possible Answer
 *
 * @param term {HTMLElement} The HTML element containing the term.
 * @return An array of the format [Description, Array<Possible Answer>]
 */
function parseTerm(term) {
    let re = /[^a-z][a-z]\) .*?(?=<br>)/g;
    let html = term.innerHTML;
    html += "<br>";

    let cutoff = html.search(re);

    let info = html.match(re);

    return [html.substring(0, cutoff), info.map((s) => s.substr(1))]
}

/**
 * Given a document fragment containing a Quizlet page,
 * parses it and puts info in the global data variable.
 */
function parseData(fragment) {
    let terms = fragment.querySelectorAll(".SetPageTerm-wordText > .TermText");
    let defs = fragment.querySelectorAll(".SetPageTerm-definitionText > .TermText");

    for (let i = 0; i < terms.length; i++) {
        let question = parseTerm(terms[i]);
        let triplet = {text: question[0], answers: question[1], mapping: parseDefs(defs[i])};
        data.push(triplet);
    }
}

// === QUIZ FUNCTIONALITY ===

/**
 * Invoked when the "Finish" button is pressed.
 */
function finish() {
    let result = document.getElementById("result");
    let resultParticle = document.getElementById("result-particle");
    let resultType = document.getElementById("result-type");
    let done = document.getElementById("done");
    let details = document.getElementById("result-details");


    let points = [0, 0, 0, 0];

    for (let set of answers.values()) {
        for (let ans of set) {
            points[ans - 1] += 1 / set.size
        }
    }

    let maxScore = getMaxValue(points);
    let results = [];

    // accounts for ties
    for (let i = 0; i < points.length; i++) {
        if (points[i] === maxScore) {
            results.push(ANSWER_TYPES[i + 1]);
        }
    }

    result.style.visibility = "unset";
    done.style.visibility = "hidden";

    // colors all questions the color of the answer they are linked to.
    let answerOptions = document.querySelectorAll("div.answer");
    for (let i = 0; i < answerOptions.length; i++) {
        // div > label > input
        let input = answerOptions[i].firstElementChild.firstElementChild;
        let thisAnswer = ANSWER_TYPES[parseInt(input.dataset.type)];
        answerOptions[i].style.color = thisAnswer.color;

        let label = answerOptions[i].firstElementChild;
        let description = document.createElement("SPAN");
        description.className = "screen-reader-text";
        description.innerText = `(${thisAnswer.name})`;
        label.appendChild(description);
    }


    resultParticle.innerText = results[0].particle;
    clearChildren(resultType);
    let first = true;
    for (result of results) {
        let informer = document.createElement("SPAN");
        informer.style.color = result.color;
        if (!first) {
            let orSpan = document.createElement("SPAN");
            orSpan.style.color = "black";
            orSpan.innerText = " or ";
            resultType.appendChild(orSpan);
        } else first = false;
        informer.innerText = result.name;
        resultType.appendChild(informer);
    }

    clearChildren(details);
    for (let i = 1; i <= points.length; i++) {
        let div = document.createElement("DIV");
        let numString = (Math.floor(points[i - 1] * 100) / 100).toString();
        div.innerHTML = `
            <span style="color: ${ANSWER_TYPES[i].color}">${ANSWER_TYPES[i].name}: ${numString}</span>
        `;
        details.appendChild(div);
    }
}

/**
 * Invoked when any checkbox is checked or unchecked.
 * @param target {HTMLInputElement} The checkbox
 */
function answerQuestion(target) {
    let answersSet = answers.get(target.dataset.question) || new Set();
    if (target.checked) {
        answersSet.add(parseInt(target.dataset.type))
    } else {
        answersSet.delete(parseInt(target.dataset.type))
    }
    answers.set(target.dataset.question, answersSet);
}

/**
 * Crafts a div element containing a single question.
 * @param number The question number.
 * @param text The question text
 * @param options The question's options.
 * @param mapping The answer types that the options link to.
 * @returns {HTMLDivElement} containing the question.
 */
function getQuestionElement(number, text, options, mapping) {
    let optionsHtml = "";
    for (let i = 0; i < options.length; i++) {
        optionsHtml += `
            <div class="form-check answer">
                <label>
                    <input data-question="${number}" data-type="${mapping[i]}" type="checkbox" class="form-check-input" onclick="answerQuestion(this)">
                    ${options[i]}
                </label>
            </div>
        `;
    }
    let html = `
        <span class="card" style="width: 100%; height: 100%;">
            <div class="card-body">
                <h5>Question ${number}</h5>
                <p class="card-text">${text}</p>
                <p class="card-text">
                    ${optionsHtml}
                </p>
            </div>
        </span>
    `;

    let elem = document.createElement("DIV");
    elem.innerHTML = html;
    elem.className = "col-md-12 col-lg-4";
    elem.style.paddingBottom = "10px";
    return elem;
}

/**
 * Initializes the quiz.
 */
function play() {
    let quizDiv = document.getElementById("quiz");
    let result = document.getElementById("result");
    let done = document.getElementById("done");

    quizDiv.innerHTML = "";
    for (let i = 0; i < answers.length; i++) {
        answers[i] = 0;
    }
    result.style.visibility = "hidden";
    done.style.visibility = "unset";

    shuffle(data);

    let lastRow = null;

    for (let i = 0; i < Math.min(12, data.length); i++) {
        let elem = getQuestionElement(i + 1, data[i].text, data[i].answers, data[i].mapping);
        if (i % 3 === 0) {
            lastRow = document.createElement("DIV");
            lastRow.className = "row";
            quizDiv.appendChild(lastRow);
        }
        lastRow.appendChild(elem);

    }
}

// === PAGE INITIALIZATION & MAIN ===

/**
 * Indicates to the user that we're done setting up, and places the onclick handler.
 */
function main() {
    let startButton = document.getElementById("start");

    startButton.onclick = play;

    startButton.innerText = "Start!";
}

/**
 * Initializes the game by pulling and parsing data from Quizlet.
 * @returns {Promise<void>}
 */
async function init() {
    let data = await fetch(QUIZLET_URL, {
        method: "GET",
        headers: {
            "X-Requested-With": "Fetch"
        }
    });
    let fragment = document.createDocumentFragment();
    let div = document.createElement("DIV");
    div.innerHTML = await data.text();
    fragment.appendChild(div);
    parseData(fragment);
}

// Initializes and sets up the quiz.
init().then(() => {
    if (document.readyState === "complete") {
        main()
    } else {
        document.addEventListener("load", main);
    }
});