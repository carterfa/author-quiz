import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './index.css';
import AuthorQuiz from './AuthorQuiz';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { shuffle, sample } from 'underscore';
import AddAuthorForm from './AddAuthorForm';

const authors = [
  {
    name: 'Mark Twain',
    imageUrl: 'images/authors/marktwain.jpg',
    imageSource: 'Wikimedia Commons',
    books: ['The Adventures of Huckleberry Finn', 'Roughin It', 'Life on the Mississippi']
  },
  {
    name: 'Charles Dickens',
    imageUrl: 'images/authors/charlesdickens.png',
    imageSource: 'Wikimedia Commons',
    books: ['A Tale of Two Cities', 'David Copperfield',]
  },
  {
    name: 'Joseph Conrad',
    imageUrl: 'images/authors/josephconrad.jpg',
    imageSource: 'Wikimedia Commons',
    books: ['Heart of Darkness']
  },
  {
    name: 'William Shakespeare',
    imageUrl: 'images/authors/williamshakespeare.jpg',
    imageSource: 'Wikimedia Commons',
    books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
  }
]

function getTurnData(authors) {
  const allBooks = authors.reduce(function (p, c, i) {
    return p.concat(c.books);
  }, []);
  const fourRandomBooks = shuffle(allBooks).slice(0, 4);
  const answer = sample(fourRandomBooks);

  return {
    books: fourRandomBooks,
    author: authors.find((author) =>
      author.books.some((title) =>
        title === answer))
  }
}

// function resetState() {
//   return {
//     turnData: getTurnData(authors),
//     highlight: ''
//   };
// }

function reducer(state = { authors, turnData: getTurnData(authors), highlight: '' }, action) {
  switch (action.type) {
    case 'ANSWER_SELECTED':
      const isCorrect = state.turnData.author.books.some((book) => book === action.answer);
      return Object.assign(
        {},
        state, {
        highlight: isCorrect ? 'correct' : 'wrong'
      });
    case 'CONTINUE':
      return Object.assign({},
        state, {
        highlight: '',
        turnData: getTurnData(state.authors)
      });
    case 'ADD_AUTHOR':
      return Object.assign({}, state, {
        authors: state.authors.concat([action.author])
      })
    default: return state;
  }

}

let store = Redux.createStore(reducer);
// let state = resetState();

// function onAnswerSelected(answer) {

//   state.highlight = isCorrect ? 'correct' : 'wrong';
//   render();
// }

// const AuthorWrapper = withRouter(({ history }) =>
//   <AddAuthorForm onAddAuthor={(author) => {
//     authors.push(author);
//     history.push('/');
//   }} />
// );

ReactDOM.render(
  <React.StrictMode>
    <ReactRedux.Provider store={store}>
      <BrowserRouter>
        <React.Fragment>
          <Route exact path="/" component={AuthorQuiz} />
          <Route path="/add" component={AddAuthorForm} />
        </React.Fragment>
      </BrowserRouter>
    </ReactRedux.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
