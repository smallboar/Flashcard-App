"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = exports.load = exports.saveScore = exports.listScores = exports.list = exports.resetForTesting = void 0;
let saved_flashcards = new Map();
let saved_scores = [];
/** Resets the state of all flashcards and scores saved,
 * ONLY FOR TESTING
 */
const resetForTesting = () => {
    saved_flashcards.clear();
    saved_scores = [];
};
exports.resetForTesting = resetForTesting;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
/** Returns a record of the names of all files stored.
 * Does not require any parameters.
 */
const list = (_, res) => {
    res.send({ list: Array.from(saved_flashcards.keys()) });
};
exports.list = list;
/** Returns a record of the names of all scores stored.
 * Does not require any parameters.
 */
const listScores = (_, res) => {
    res.send({ list: saved_scores });
};
exports.listScores = listScores;
/**
 * Saves a new score by a given user, takes a "name"
 * parameter, responds with 400  if this name is missing.
 * Will replace the data from a file
 * */
const saveScore = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('missing "name" parameter');
        return;
    }
    const score = req.body.score;
    const testname = req.body.testname;
    if (score === undefined || score === null) {
        res.status(400).send('missing "data" parameter');
        return;
    }
    else if (typeof score !== "number") {
        res.status(400).send('Type of "data" parameter is not number');
        return;
    }
    if (testname === undefined || testname === null) {
        res.status(400).send('missing "testname" parameter');
        return;
    }
    else if (typeof testname !== "string") {
        res.status(400).send('Type of "testname" parameter is not string');
        return;
    }
    saved_scores.push(name + ", " + testname + ": " + score);
    res.send("Successfuly stored score of: " + score);
};
exports.saveScore = saveScore;
/**
 * Loads the contents of a file (JSON) from a given name
 * Takes a "name" parameter of the file, responds with 400
 * if this name is missing. If there is no corresponding file
 * to the given name, responds with 404. Otherwise, returns the
 * record containing a "data" parameter with the data from the file.
 * */
const load = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('missing "name" parameter');
        return;
    }
    else if (!saved_flashcards.has(name)) {
        res.status(404).send('That name does not have a corresponding file.');
        return;
    }
    res.send({ data: saved_flashcards.get(name) });
};
exports.load = load;
/**
 * Saves the contents of a file (JSON) with a given name
 * Takes a "name" parameter of the file, responds with 400
 * if this name is missing. Will replace the data from a file
 * with the same name.
 * */
const save = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('missing "name" parameter');
        return;
    }
    let data = req.body.data;
    if (data === undefined || data === null) {
        res.status(400).send('missing "data" parameter');
        return;
    }
    saved_flashcards.set(name, data);
    res.send("Successfully stored file under name: " + name);
};
exports.save = save;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxJQUFJLGdCQUFnQixHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQztBQUN4RSxJQUFJLFlBQVksR0FBYSxFQUFFLENBQUM7QUFFaEM7O0dBRUc7QUFDSSxNQUFNLGVBQWUsR0FBRyxHQUFTLEVBQUU7SUFDeEMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUNwQixDQUFDLENBQUE7QUFIWSxRQUFBLGVBQWUsbUJBRzNCO0FBR0Qsd0VBQXdFO0FBQ3hFLDRFQUE0RTtBQUM1RSxtREFBbUQ7QUFDbkQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFjLEVBQW9CLEVBQUU7SUFDakQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO1NBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDcEMsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNO1FBQ0wsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNJLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBYyxFQUFFLEdBQWlCLEVBQVEsRUFBRTtJQUM5RCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBRlcsUUFBQSxJQUFJLFFBRWY7QUFHRjs7R0FFRztBQUNJLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBYyxFQUFFLEdBQWlCLEVBQVEsRUFBRTtJQUNwRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVB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