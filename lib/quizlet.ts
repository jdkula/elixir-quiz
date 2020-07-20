/**
 * quizlet.ts
 * ===========
 * Contains functions to parse Questions from
 * a provided Quizlet of a certain format.
 */
import { Question, Answer } from './quiz';
import { getElixir, ScoredElixirType } from './elixir';
import md5 from 'md5';

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

    return text.split('<br>').map((s) => parseInt(s.substr(s.search(/\d+/)).trim()));
}

/**
 * Parses a question from the quizlet,
 * grabbing all the text until the first answer (beginning with 'a)')
 */
export function parseQuestion(question: Element): string {
    const text = question.textContent;

    const cutoff = text.indexOf('a)');

    return text.substring(0, cutoff).trim();
}

/**
 * Parses a list of answers from the quizlet. Answers look like:
 * a) an answer<br>
 */
export function parseAnswers(question: Element): string[] {
    const re = /[^a-z][a-z]\) .*?(?=<br>)/g;
    let html = question.innerHTML;
    html += '<br>';
    const info = html.match(re);

    // substr(3) removes " x)"
    return info.map((s) => s.substr(3).trim());
}

/**
 * Parses a single flashcard into a Question.
 */
export function parseFlashcard(flashcard: Element): Question {
    const questionHtml = flashcard.querySelector('.SetPageTerm-wordText > .TermText');
    const assignmentHtml = flashcard.querySelector('.SetPageTerm-definitionText > .TermText');

    const question = parseQuestion(questionHtml);
    const answerTexts = parseAnswers(questionHtml);
    const assignments = parseAssignments(assignmentHtml);

    const answers: Answer[] = [];

    // assert(answerTexts.length === assignmentsRaw.length)

    for (let i = 0; i < answerTexts.length; i++) {
        const elixir = getElixir(assignments[i]);
        if (!elixir) continue;

        answers.push({
            text: answerTexts[i],
            assignment: elixir.type as ScoredElixirType, // no assignment will lead to Neutral
        });
    }

    return {
        id: md5(question),
        question,
        answers,
    };
}

/**
 * Parses an entire Quizlet into an unordered set of questions.
 */
export function parseQuizlet(document: Element): Set<Question> {
    const flashcards = document.querySelectorAll('.SetPageTerms-term');
    const set = new Set<Question>();

    for (const flashcard of flashcards) {
        set.add(parseFlashcard(flashcard));
    }

    return set;
}
