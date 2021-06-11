import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hey there! I am {process.env.REACT_APP_NAME_PH}.
        </p>
        <p>
        And this is {process.env.REACT_APP_STAGE_PH} stage.
        </p>
      </header>
    </div>
  );
}

export default App;
