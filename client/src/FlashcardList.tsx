import React, { Component, MouseEvent } from 'react';
import { isRecord } from './record';


type ListProps = {
  /**Callback function that switches the page to create a new flashcard */
  onNewClick: (names: string[]) => void,
  /**Callback function that will allow the user to test themselves on that test*/
  onFlashcardClick: (name: string) => void
};

type ListState = {
  /**List of the test names to be displayed */
  names: string[],
  /**List of scores to be displayed */
  scoreNames: string[]
};


// Shows the list of all the Squares.
export class FlashCardList extends Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {names: [], scoreNames: []};
  }

  //Calls the refresh click, which fetches the score list and test list
  //to display.
  componentDidMount = (): void => {
    this.doRefreshClick();
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h1>List</h1>
        {this.renderTestNames()}
        <button type="button" onClick={this.doRefreshClick}>Refresh</button>
        <button type="button" onClick={this.doNewClick}>New Flashcard</button>
        <h1>Scores</h1>
        {this.renderScores()}
      </div>);
  };

  //Renders the testnames to be displayed, making them clickable.
  renderTestNames = (): JSX.Element => {
    if (this.state.names === undefined || this.state.names.length === 0) {
      return <p>Save your first flashcard!</p>;
    } else {
      const flashcardArr: JSX.Element[] = [];
      for (const name of this.state.names) {
        flashcardArr.push(
          <li key={name}>
            <a href="#" onClick={(evt) => this.doFlashcardClick(evt, name)}>{name}</a>
          </li>);
      }
      return <ul>{flashcardArr}</ul>;
    }
  };

  //Renders the list of scores
  renderScores = (): JSX.Element => {
    if (this.state.scoreNames === undefined || this.state.scoreNames.length === 0) {
      return <p>Save your first test!</p>;
    } else {
      const scoreArr: JSX.Element[] = [];
      for (const name of this.state.scoreNames) {
        scoreArr.push(<li key={name}><a>{name}</a></li>);
      }
      return <ul>{scoreArr}</ul>;
    }
  };

  //Handles the response of calling the /api/list GET request
  doListResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doListJson)
          .catch(() => this.doListError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doListError)
          .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${resp.status}`);
    }
  };

  //Translates the response to JSON and sets the state, from /api/list
  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }

    const list = data.list;
    if (!Array.isArray(list)) {
      console.error("bad data from /api/list: data is not an array", list);
      //console.error("Data type:" + (typeof data));
      return;
    }
    this.setState({names: list});
  };

  //Throws errors for anything that went wrong.
  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  //Fetches the /api/list to refresh the overall state.
  doRefreshClick = (): void => {
    fetch("/api/list").then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server"));
    this.doScoreRefreshClick();
  };

  //Fetches the api/listScores to refresh the overall state.
  doScoreRefreshClick = (): void => {
    fetch("/api/listScores").then(this.doScoreResp)
        .catch(() => this.doListError("failed to connect to server"));
  }

  //Handles the response to the /api/listScores GET request
  doScoreResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doScoreJson)
          .catch(() => this.doScoreError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doScoreError)
          .catch(() => this.doScoreError("400 response is not text"));
    } else {
      this.doScoreError(`bad status code from /api/listScores: ${resp.status}`);
    }
  };

  //Translates the response to json and sets the state for /api/listScores
  doScoreJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/listScores: not a record", data);
      return;
    }

    const list = data.list;
    if (!Array.isArray(list)) {
      console.error("bad data from /api/listScores: data is not an array", list);
      //console.error("Data type:" + (typeof data));
      return;
    }
    this.setState({scoreNames: list});
  };

  //Throws any errors in the process of calling /api/listScores
  doScoreError = (msg: string): void => {
    console.error(`Error fetching /api/listScores: ${msg}`);
  };

  //Calls the passed in callback function to create a new test, and passes the 
  //parameter names, so that the new flashcard won't duplicate an existing name.
  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onNewClick(this.state.names);  // tell the parent to show the new squares page
  };

  //Calls the passed in callback function to click a flashcard, to begin testing.
  doFlashcardClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onFlashcardClick(name);
  };
}
