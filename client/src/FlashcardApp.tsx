import React, { Component} from "react";
import { FlashCardList } from "./FlashcardList";
import {NewFlashcard} from "./NewFlashcard";
import {FlashcardTest} from "./FlashcardTest";
import { Flashcard, fromJson } from "./Flashcard";

type Page = {kind: "list"} | {kind: "newCard"} | {kind: "renderFlashcard", data: Flashcard[]}; 


type FlashcardAppState = {
  /** The current state of the page, what should the App render. */
  page : Page;
  
  /** String representation of the name. Separated from
   * "page" because I need to update keep rendering "askName" page 
   * until they submit, while also updating the state of the name.
   */
  name : string | undefined;

  /**List of the names of tests that exist already */
  listNames: string[];
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: {kind: "list"}, name: undefined, listNames: []};
  }
  
  render = (): JSX.Element => {
    if (this.state.page.kind === "list") {
      return <FlashCardList onNewClick={this.doNewClick} onFlashcardClick={this.doFlashcardClick}></FlashCardList>
    } else if (this.state.page.kind === "newCard") {
      return <NewFlashcard onAddClick={this.doAddClick} onBackClick={this.doBackClick} listNames={this.state.listNames}></NewFlashcard>
    } else if (this.state.page.kind === "renderFlashcard") {
      if (this.state.name === undefined) {
        throw new Error("Name is undefined!");
      }
      return <FlashcardTest data={this.state.page.data} name={this.state.name} doFinishChange={this.doFinishClick}/>
    } else {
      throw new Error("Render failed.");
    }
  };

  //Handles the users trying to save their score to the server, calling
  ///api/save, a POST request.
  doFinishClick = (testName: string, score: number, submittedName: string): void => {
    fetch("/api/saveScore/?" + new URLSearchParams({name: submittedName}), {
      method: "POST",  
      body:  JSON.stringify({score: score, testname: testName}),
      headers: {"Content-Type": "application/json"} })
    .then((res) => this.doFinishResponse(res))
    .catch(() => this.doError("/saveScore: failed to connect to server"))
  }

  // Called with the response from a request to /api/save
  doFinishResponse = (res: Response): void => {
    if (res.status === 200) {
      alert("Succesfully saved your flashcard!");
      this.setState({page: {kind: "list"}, name: this.state.name});
    } else if (res.status === 400) {
      res.text().then(this.doError)
         .catch(() => this.doError("/saveScore: 400 response is not text"));
    } else {
      this.doError(`/saveScore: bad status code ${res.status}`);
    }
  };
  


  //Handles the users trying to save their flaschard to the server, calling
  ///api/save, a POST request.
  doAddClick = (name: string, options: Flashcard[]): void => {
    if (name === undefined) {
      throw new Error("Cannot save, name is undefined.");
    }
    fetch("/api/save/?" + new URLSearchParams({name: name}), {
      method: "POST",  
      body:  JSON.stringify({data: options}),
      headers: {"Content-Type": "application/json"} })
    .then((res) => this.doAddResponse(res))
    .catch(() => this.doError("/save: failed to connect to server"))
  }

  // Called with the response from a request to /api/save
  doAddResponse = (res: Response): void => {
    if (res.status === 200) {
      alert("Succesfully saved your flashcard!");
      this.setState({page: {kind: "list"}, name: this.state.name});
    } else if (res.status === 400) {
      res.text().then(this.doError)
         .catch(() => this.doError("/save: 400 response is not text"));
    } else {
      this.doError(`/save: bad status code ${res.status}`);
    }
  };

  //Callback function that returns the user from the NewFlashcard page, back
  //to the list page.
  doBackClick = (): void => {
    this.setState({page: {kind: "list"}, name: this.state.name});
  }

  //Updates the state where the user will now be prompted to give the name of a new square.
  doNewClick = (names: string[]): void => {
    this.setState({page:{kind:"newCard"}, name: undefined, listNames: names});
  }
  
  //Calls the api/load api from the server to retrieve the flashcards of the given test name.
  doFlashcardClick = (name: string) : void => {
    fetch(`/api/load?name=${encodeURIComponent(name)}`)
    .then(res => this.doFlashcardClickJson(res, name))
    .catch((error) => this.doError("/load: failed to connect to server" + error));
  }

  //Translates the json data of the flashcards from doFlashcardClick
  doFlashcardClickJson = (res: Response, name: string): void => {
    if(res.status === 200) {
      res.json().
        then((json) => this.doFlashcardHandlingClick(json.data, name))
        .catch((error) => console.error("Not JSON," + error));
    } else {
      this.doError("/load: status is not 200");
    }
  }

  //Does the final translating from the json to the array of flashcards, and updates the state.
  doFlashcardHandlingClick = (arr: unknown, name: string): void => {
    const flashcards = fromJson(arr);

    this.setState({page:{kind: "renderFlashcard", data: flashcards}, name: name});
  };



  // Called when we fail anything that we want to console.error.
  doError = (msg: string): void => {
    console.error(`Error fetching ${msg}`);
  };

}

