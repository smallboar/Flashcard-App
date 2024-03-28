import React, { ChangeEvent, Component } from "react";
import { Flashcard } from "./Flashcard";
import "./style.css";

type TestProps = {
  /** Name of the test to display */
  name: string;
  /** The actual data (flashcards) to test them on */
  data: Flashcard[];
  /**Callback function to finish the test and post the score to the server. */
  doFinishChange: (testname: string, score: number, submittedName: string) => void;
};

type Page = {kind: "test"} | {kind: "finished"};

type TestState = {
  /**The name of the test we are taking(displayed on top) */
  testname: string;
  /*The kind of the page that we are displaying*/
  page: Page;
  /**The index of the flashcards we are reviewing in the array */
  index: number;
  /**The actual flashcards we are testing them on. */
  flashcards: Flashcard[];
  /**The number of correct answers they have */
  correct: number;
  /** The number of incorrect answers they have */
  incorrect: number;
  /** Boolean value if we should display the front or back */
  showFront: boolean;
  /** String value of the submitted name at the end of the test */
  submittedName: string;
  /** If we should display an error or not*/
  isError: boolean;
};


/** UI for editing the image. */
export class FlashcardTest extends Component<TestProps, TestState> {
  
  constructor(props: TestProps) {
    super(props);
    this.state = {testname: props.name, page: {kind: "test"}, index: 0, flashcards: props.data, correct: 0, incorrect: 0, showFront: true, submittedName: "", isError: false};
  }


  //Not really a click, just displays the correctness on the top.
  doCorrectnessHandleClick = (): JSX.Element => {
    return (
      <h2>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h2>
    );
  }
  
  //Increases the number of correct answers, as well as the index to display the next card.
  //If the index is at the end of the array, display the finished page.
  doCorrectClick = (): void => {
    if (this.state.index === this.state.flashcards.length - 1) {
      this.setState({page: {kind: "finished"}, showFront: true});
    }
    this.setState({correct: this.state.correct + 1, index: this.state.index + 1, showFront: true});
  }

  //Increases the number of incorrect answers, as well as the index to display the next card.
  //If the index is at the end of the array, display the finished page.
  doIncorrectClick = (): void => {
    if (this.state.index === this.state.flashcards.length - 1) {
      this.setState({page: {kind: "finished"}, showFront: true});
    }
    this.setState({incorrect: this.state.incorrect + 1, index: this.state.index + 1, showFront: true});
  }

  //Flips the state so that it will now show the other side of the card.
  doFlipClick = (): void => {
    this.setState({showFront: !this.state.showFront});
  }

  //Shuffles the given array, and resets all the scores and states so that the user 
  //can start from the beginning with new randomly shuffled flashcards
  doShuffleClick = (): void => {
    //Randomizes the order!
    const newFlashcards = this.state.flashcards
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    this.setState({index: 0, flashcards: newFlashcards, correct: 0, incorrect: 0, showFront: true});
  }

  //Returns if there is an error, to tell the user to submit a name.
  //If there is no error, display nothing.
  doErrorJSXClick = (): JSX.Element => {
    if (this.state.isError) {
      return <div className="error">Error: You must submit a name.</div>
    } else {
      return <div></div>
    }
  }

  render = (): JSX.Element => {
    if (this.state.page.kind === "test") {
        return (
          <div>
            <h1>{this.state.testname}</h1>
            {this.doCorrectnessHandleClick()}
            <div className="card">{this.state.showFront ? this.state.flashcards[this.state.index].front : this.state.flashcards[this.state.index].back}</div>
            <button type="button" onClick={this.doFlipClick}>Flip</button>
            <button type="button" onClick={this.doCorrectClick}>Correct</button>
            <button type="button" onClick={this.doIncorrectClick}>Incorrect</button>
            <button type="button" onClick={this.doShuffleClick}>Shuffle</button>
          </div>
        );
    } else {
      return (
        <div>
          <h1>{this.state.testname}</h1>
          {this.doCorrectnessHandleClick()}
          <div>End of quiz</div>
          <form onSubmit={this.doFinishChange} id="form">
            <label htmlFor="Name">Name:</label>
            <input type="text" id="Name" name="Name" onChange={this.doNameChange}></input>
            <input type="submit" value="Submit"></input>
          </form>
          {this.doErrorJSXClick()}
        </div>
      );
    }
    
  };
  
  //Ensures that the user submitted a name, and if they didn't, display an error.
  //PreventDefault is there to stop it from submitting.
  //Otherwise, calls the callback function to finish the test.
  doFinishChange = (_evt: React.FormEvent<HTMLFormElement>): void => {
    _evt.preventDefault();
    if (this.state.submittedName === null || this.state.submittedName === "") {
      this.setState({isError: true})
    } else {
      this.props.doFinishChange(this.state.testname, Math.floor(100*(this.state.correct)/(this.state.correct + this.state.incorrect)), this.state.submittedName);
    }
  };

  //Handles updating the name whenever the user types something in the input box.
  doNameChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    const name = _evt.target.value;
    if (name !== undefined && name !== "") {
      this.setState({isError: false});
    }
    this.setState({submittedName: name});
  };
}
  
