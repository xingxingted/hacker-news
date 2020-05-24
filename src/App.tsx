import * as React from "react";
import Header from './components/Header';
import "./styles.css";
import Article from "./components/Article";
import Form from "./components/Form";
import Comments from "./components/Comments";

export default function App() {
  return (
      <div className="App">
          <Header />
          <main>
              <Article />
              <Form />
              <Comments />
          </main>
      </div>
  );
}
