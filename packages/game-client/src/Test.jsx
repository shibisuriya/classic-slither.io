import React, { useEffect, useState, useRef } from 'react';

function Test() {
	// const [count, setCount] = useState(0);
	const counterRef = useRef(10);

	useEffect(() => {
		const timer = setInterval(() => {
			console.log(Date.now(), ' Hello from inside of the timer. count => ', counterRef.current);
		}, 500);
		return () => {
			clearInterval(timer);
		};
	}, []);

	const increment = () => {
		counterRef.current++;
	};

	return (
		<div>
			<h1>count: {counterRef.current}</h1>
			<button onClick={increment}>++</button>
		</div>
	);
}

export default Test;
