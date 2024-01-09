import { useState } from "react";
import './App.css';

const App = () => {
    const [ count, setCount ] = useState(0);

    return (
        <>
            <h1>Counter</h1>
            <button onClick={() => setCount((count) => ++count)}>Count: { count }</button>
        </>
    )
};

export default App;
