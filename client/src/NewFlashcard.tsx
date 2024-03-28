import React, { Component, ChangeEvent } from 'react';
import { Flashcard, toJson } from './Flashcard';
// import { isRecord } from './record';
// import {Flashcard, Pair} from "./Flashcard"


type CardProps = {
  /**Callback function that posts the current flashcard to the server */
  onAddClick: (name: string, options: Flashcard[]) => void;
  /** Callback function that takes the user back to the list page. */
  onBackClick: () => void;

  /**List of the names that are already stored, 
   * to make sure we don't store any duplicates
   */
  listNames: string[];
};

type CardState = {
    /**Name of the flashcard */
    name: string;
    /**Options given by the client */
    options: string;
    /**State of if there is an error to display or not, and the message */
    error: {isError: boolean, message: string};
};

// Shows the list of all the Squares.
export class NewFlashcard extends Component<CardProps, CardState> {
    constructor(props: CardProps) {
      super(props);
      this.state = {name: "", options: "", error: {isError: false, message: ""}};
    }

    

    //Not a click, just satisfying linter
    //Returns the div for an error, making it empty if there isn't any error.
    doErrorMessageClick = (): JSX.Element => {
      
        if (this.state.error.isError) {
            return <div style={{color: "red"}}>{this.state.error.message}</div>
        } else {
            return <div></div>;
        }
    };
  
    render = (): JSX.Element => {
      const error = this.doErrorMessageClick();
      return (
        <div>
          <h2>Create</h2>
          <form>
            <label htmlFor="Name">Name:</label>
            <input type="text" id="Name" name="Name" onChange={this.doNameChange}></input>
          </form>
          <div>
            <label htmlFor="textbox">Options (one per line, formatted as front|back)</label>
            <br/>
            <textarea id="textbox" rows={10} cols={40}
            onChange={this.doOptionsChange}></textarea>
          </div>
          <button type="button" onClick={this.doAddClick}>Add</button>
          <button type="button" onClick={this.props.onBackClick}>Back</button>
          {error}
        </div>);
    };

  // If there are errors, this will update the state to display errors, otherwise it will
  //call the callback function that will post this new flashcard to the server.
  doAddClick = (): void => {
    if (this.state.name === "") {
        this.setState({name: this.state.name, options: this.state.options, error: {isError: true, message: "Error: Name should not be empty"}});
        return;
    } else if (this.state.options === "" || this.state.options.indexOf("|") === -1) {
        this.setState({name: this.state.name, options: this.state.options, error: {isError: true, message: "Error: No cards"}});
        return;
    } else if (this.props.listNames.indexOf(this.state.name.trim()) !== -1) {
      this.setState({error: {isError: true, message: "Error: Name already exists, choose another one!"}})
    } else {
      try {
        const flashcards = toJson(this.state.options.trim());
        this.props.onAddClick(this.state.name, flashcards);
        this.setState({name: this.state.name, options: this.state.options, error: {isError: false, message: ""}});
      } catch(_: unknown) {
        this.setState({error: {isError: true, message: "Error: Bad input, check over your input!"}})
      }
    }
  }

  //Handles when the user updates the text in the new name field, updating the state each time.
  doNameChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: _evt.target.value, options: this.state.options})
  }

  //Handles when the user updates the text in the options field, updating the state each time.
  doOptionsChange = (_evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({name: this.state.name, options: _evt.target.value})
  }


}