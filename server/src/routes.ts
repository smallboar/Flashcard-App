import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

let saved_flashcards: Map<string, unknown> = new Map<string, unknown>();
let saved_scores: string[] = [];

/** Resets the state of all flashcards and scores saved,
 * ONLY FOR TESTING
 */
export const resetForTesting = (): void => {
  saved_flashcards.clear();
  saved_scores = [];
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/** Returns a record of the names of all files stored.
 * Does not require any parameters.
 */
export const list = (_: SafeRequest, res: SafeResponse): void => {
  res.send({list: Array.from(saved_flashcards.keys())});
};


/** Returns a record of the names of all scores stored.
 * Does not require any parameters.
 */
export const listScores = (_: SafeRequest, res: SafeResponse): void => {
  res.send({list: saved_scores});
};

/** 
 * Saves a new score by a given user, takes a "name" 
 * parameter, responds with 400  if this name is missing. 
 * Will replace the data from a file
 * */
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
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
  } else if (typeof score !== "number") {
    res.status(400).send('Type of "data" parameter is not number');
    return;
  }

  if (testname === undefined || testname === null) {
    res.status(400).send('missing "testname" parameter');
    return;
  } else if (typeof testname !== "string") {
    res.status(400).send('Type of "testname" parameter is not string');
    return;
  }
  
  saved_scores.push(name + ", " + testname + ": " + score);
  res.send("Successfuly stored score of: " + score);
};

/** 
 * Loads the contents of a file (JSON) from a given name 
 * Takes a "name" parameter of the file, responds with 400
 * if this name is missing. If there is no corresponding file
 * to the given name, responds with 404. Otherwise, returns the 
 * record containing a "data" parameter with the data from the file.
 * */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('missing "name" parameter');
    return;
  } else if (!saved_flashcards.has(name)) {
    res.status(404).send('That name does not have a corresponding file.');
    return;
  }
  res.send({data: saved_flashcards.get(name)});
}

/** 
 * Saves the contents of a file (JSON) with a given name
 * Takes a "name" parameter of the file, responds with 400
 * if this name is missing. Will replace the data from a file
 * with the same name.
 * */
export const save = (req: SafeRequest, res: SafeResponse): void => {
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
}







