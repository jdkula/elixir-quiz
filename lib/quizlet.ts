/**
 * Given a [definition] of the form:
 * a) [number]<br>
 * b) [number]<br>
 * ...
 *
 * returns the numbers in order.
 */
export function parseAssignments(definition: Element): number[] {
    const text = definition.innerHTML;

    return text.split("<br>").map((s) => parseInt(s.substr(s.search(/\d+/)).trim()));
}

const kMapping: { [k: number]: Elixir } = {
    1: { type: "Aura", color: "#4a851b", particle: "an" },
    2: { type: "Elemental", color: "#aa8500", particle: "an" },
    3: { type: "Enchanter", color: "#8632aa", particle: "an" },
    4: { type: "Transformer", color: "#aa2000", particle: "a" },
};

type ElixirType = "Aura" | "Elemental" | "Enchanter" | "Transformer";

interface Elixir {
    type: ElixirType;
    color: string;
    particle: "a" | "an";
}

interface Answer {
    text: string;
    assignment: Elixir;
}

interface Question {
    question: string;
    answers: Answer[];
}

/**
 * Parses a term from Quizlet. Terms take the format:
 * Description<br>Description<br>a) Possible Answer<br>b) Possible Answer<br>c) Possible Answer
 *
 * @param The HTML element containing the term.
 */
export function parseQuestion(question: Element): string {
    const re = /[^a-z][a-z]\) .*?(?=<br>|\n)/g;
    const text = question.textContent;

    const cutoff = text.indexOf("a)");

    return text.substring(0, cutoff).trim();
}

/**
 * Parses a term from Quizlet. Terms take the format:
 * Description<br>Description<br>a) Possible Answer<br>b) Possible Answer<br>c) Possible Answer
 *
 * @param The HTML element containing the term.
 */
export function parseAnswers(question: Element): string[] {
    const re = /[^a-z][a-z]\) .*?(?=<br>)/g;
    let html = question.innerHTML;
    html += "<br>";
    const info = html.match(re);

    return info.map((s) => s.substr(4).trim());
}

export function parseFlashcard(flashcard: Element): Question {
    const questionHtml = flashcard.querySelector(".SetPageTerm-wordText > .TermText");
    const assignmentHtml = flashcard.querySelector(".SetPageTerm-definitionText > .TermText");

    const question = parseQuestion(questionHtml);
    const answerTexts = parseAnswers(questionHtml);
    const assignments = parseAssignments(assignmentHtml);

    const answers: Answer[] = [];

    // assert(answerTexts.length === assignmentsRaw.length)

    for (let i = 0; i < answerTexts.length; i++) {
        answers.push({
            text: answerTexts[i],
            assignment: kMapping[assignments[i]],
        });
    }

    return {
        question,
        answers,
    };
}

export function parsePage(fragment: Element): Set<Question> {
    const flashcards = fragment.querySelectorAll(".SetPageTerms-term");
    const set = new Set<Question>();

    for (const flashcard of flashcards) {
        set.add(parseFlashcard(flashcard));
    }

    return set;
}
