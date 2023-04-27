import React from 'react'
import './App.css';
import Home from './components/home';
// function Fruit({buttons_text}) {
//   console.log("cliked");
//   // return (<button onClick={Fruit} buttons_text={buttons_text ? "apple" : "banana"}>{buttons_text}</button>);
//   if (buttons_text === "banana") {
//     console.log("inside if")
//     return (<button onClick={Fruit} buttons_text="apple">apple</button>);
//   }
//   console.log("outside if")
//   return (<button onClick={Fruit} buttons_text="banana">banana</button>);
// }
// <Fruit buttons_text={"banana"}></Fruit>

function App() {
  return (
    <>
      <div className="App">
          <Home/>
      </div>
    </>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// <button id="button1" onClick={fruit}>banana</button>

export default App;
