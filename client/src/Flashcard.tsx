import { isRecord } from "./record";

/** This is a type representing a flashcard */
export type Flashcard = {
    /**Front text to display for the flashcard */
    front: string;
    /**Back text to display for the flashcard */
    back: string;
}

/**
 * Translates the data from JSON to an array of flashcards, or throws errors
 * if the data is invalid.
 * @param data is the JSON response from the server to be translated.
 * @returns An array of flashcards from the translated JSON response from the server.
 * @throws Throws an error if:
 *            data is undefined, or is not a record
 *            the list: parameter of data is not an array
 *            if any of the elements in the array are not records
 *            if any of the elements in the array do not contain front/back and as strings
 */          
export const fromJson = (data: unknown) : Flashcard[] => {
    if (data === undefined || !isRecord(data)) {
        throw new Error("bad data from /api/list: not a record");
    }
    if (!Array.isArray(data)) {
        throw new Error("bad data from /api/load: not an array");
    }

    const flashcardArr = [];

    for (const flashcard of data) {
        if (!isRecord(flashcard)) {
            throw new Error("Bad data from /api/load: flashcard is not a record");
        } else {
            const front = flashcard.front;
            const back = flashcard.back;

            if (front === undefined || front === null || typeof front !== "string") {
                throw new Error("bad data from /api/load: front of flashcard does not exist or is not a string");
            } else if (back === undefined || back === null || typeof back !== "string") {
                throw new Error("bad data from /api/load: back of flashcard does not exist or is not a string");
            }

            const newCard: Flashcard = {front: front, back: back};
            flashcardArr.push(newCard);
        }
    }
    return flashcardArr;
}

/**
 * Translates the text that the user inputs, for the options in their test into JSON to be sent
 * to the server to be saved.
 * @param options is the input string text that the user inputs when creating a new flashcard.
 * @returns An array of flashcards representing the users input, or throws an error
 * @throws An error when:
 *            options is null or empty
 *            options does not have any lines when splitting by "\n"
 *            any line in options doesnt have exactly two (front|back) when splitting by "|"
 *            any of the front|back options are undefined
 */           
export const toJson = (options: string): Flashcard[] => {
    if (options === null || options.length === 0) {
        throw new Error("Options is empty");
    }
    const flashcards: Flashcard[] = [];
    const pairs = options.split("\n");

    if (pairs.length === 0) {
        throw new Error("There are no flashcards.");
    }

    for (const pair of pairs) {
        const pairSplit = pair.split("|");
        if (pairSplit.length !== 2) {
            throw new Error("Error converting flashcards, wrong number of '|' for " + "pair: " + pair);
        }
    
        const front = pairSplit.at(0);
        const back = pairSplit.at(1);
        if (front === undefined || back === undefined) {
            throw new Error("Error converting flashcards.");
        }
    
        const flashcard: Flashcard = {front: front, back: back};
        flashcards.push(flashcard);
    }
    return flashcards;
}