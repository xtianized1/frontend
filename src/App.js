import React from 'react';
import './App.css';
import Autocomplete from './components/Autocomplete';
// import CreateTodo from './components/CreateTodo';

function App() {
    return (
        <div className="App">
            <h1>Staged Book-Autocomplete</h1>
            <Autocomplete />
        </div>
    );
}

export default App;
