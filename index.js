// === GLOBALS ===

/** Where to pull data from (in this case, Mark's quizlet. */
const QUIZLET_URL = "https://cors-anywhere.herokuapp.com/https://quizlet.com/384316477/elixer-assignments-flash-cards/";

/** Data about each answer type */
const ANSWER_TYPES = {
    1: {name: "Aura", color: "#303a85"},
    2: {name: "Elemental", color: "#aa8500"},
    3: {name: "Enchanter", color: "#00aa53"},
    4: {name: "Transformer", color: "#aa0098"}
};

/** Stores the user's answers, one slot for each answer they picked corresponding to each answer type. */
let answers = [0, 0, 0, 0];

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
 * Reads in all text from a Uint8Array stream.
 * @param stream {ReadableStream<Uint8Array>} The stream to read in
 * @returns {Promise<string>} When the promise completes, the result will be the whole string.
 */
async function getStreamText(stream) {
    let text = "";
    let reader = stream.getReader();
    let read = reader.read();
    while (!read.done) {
        text += new TextDecoder("utf-8").decode(read.value);
        read = await reader.read();
    }
    return text;
}

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
function getMaxIndex(array) {
    let maxIndex = 0;
    let maxValue = -1;
    for(let i = 0; i < array.length; i++) {
        if(array[i] > maxValue) {
            maxIndex = i;
            maxValue = array[i];
        }
    }

    return maxIndex + 1;
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
    let resultType = document.getElementById("result-type");
    let done = document.getElementById("done");
    let details = document.getElementById("result-details");

    let answer = ANSWER_TYPES[getMaxIndex(answers)];

    result.style.visibility = "unset";
    done.style.visibility = "hidden";

    resultType.style.color = answer.color;

    // colors all questions the color of the answer they are linked to.
    let answerOptions = document.querySelectorAll("div.answer");
    for (let i = 0; i < answerOptions.length; i++) {
        // div > label > input
        let thisAnswer = ANSWER_TYPES[parseInt(answerOptions[i].firstElementChild.firstElementChild.dataset.type)];
        answerOptions[i].style.color = thisAnswer.color;
        answerOptions[i].setAttribute("aria-label", thisAnswer.name)
    }


    resultType.innerText = answer.name;

    details.innerHTML = "";
    for(let i = 1; i <= answers.length; i++) {
        let div = document.createElement("DIV");
        div.innerHTML = `
            <span style="color: ${ANSWER_TYPES[i].color}">${ANSWER_TYPES[i].name}: ${answers[i - 1]}</span>
        `;
        details.appendChild(div);
    }
}

/**
 * Invoked when any checkbox is checked or unchecked.
 * @param target {HTMLInputElement} The checkbox
 */
function answerQuestion(target) {
    console.log(target);
    answers[parseInt(target.dataset.type) - 1] += target.checked ? 1 : -1;
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
                    <input data-type="${mapping[i]}" type="checkbox" class="form-check-input" onclick="answerQuestion(this)">
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

    for (let i = 0; i < 12; i++) {
        let elem = getQuestionElement(i + 1, data[i].text, data[i].answers, data[i].mapping);
        if (i % 3 === 0) {
            lastRow = document.createElement("DIV");
            lastRow.className = "row";
            lastRow.style.paddingBottom = "10px";
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
    div.innerHTML = await getStreamText(data.body);
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