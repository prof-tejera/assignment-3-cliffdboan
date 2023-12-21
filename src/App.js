import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import { ErrorBoundary } from "react-error-boundary";

import DocumentationView from "./views/DocumentationView";
import AddPage from "./views/AddPage";
import TimersView from "./views/TimersView";
import TimerProvider from "./utils/timerProvider";

const Container = styled.div`
  background: #dbdcda;
  color: black;
  height: 100vh;
  overflow: auto;
  -webkit-text-stroke-width: .15px;
  -webkit-text-stroke-color: black;
`;

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
};

const Nav = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <nav>
        <ul>
          <li>
            <Link to="/">Timers</Link>
          </li>
          <li>
            <Link to="/add">Add</Link>
          </li>
          <li>
            <Link to="/docs">Documentation</Link>
          </li>
        </ul>
      </nav>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container>
        <Router>
          <Nav />
          <TimerProvider>
            <Routes>
              <Route path="/docs" element={<DocumentationView />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/" element={<TimersView />} />
            </Routes>
          </TimerProvider>
        </Router>
      </Container>
    </ErrorBoundary>
  );
};

export default App;
