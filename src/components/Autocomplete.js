import React, { useState, useEffect } from 'react';
import axios from 'axios';
import booksData from '../assets/books.json';

const Autocomplete = () => {
    const fetch_todos_url = process.env.REACT_APP_API_FETCH_TODO || "http://localhost:8000";
    const create_todo_url = process.env.REACT_APP_API_CREATE_TODO || "http://localhost:8000";
    const fetch_todos_url_key = process.env.REACT_APP_API_FETCH_TODO_KEY || "";
    const create_todo_url_key = process.env.REACT_APP_API_CREATE_TODO_KEY || "";
    const apiKey = process.env.REACT_APP_API_KEY;
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [todo_title, settodo_Title] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1); 
    const [todos, setTodos] = useState([]); 

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${fetch_todos_url}/api/books/?query=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${fetch_todos_url_key}`
                }
            });
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    useEffect(() => {
        fetchTodos(); 
    }, []);

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        
        if (searchQuery.length > 2) {
            
            const filteredBooks = booksData.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
    
            setResults(filteredBooks); 
            setHighlightedIndex(-1);    
        } else {
            setResults([]);
        }
    };

    const handleSelect = (book) => {
        setSelectedBook(book);
        setQuery(book.title);  
        setResults([]);        
        console.log(`Selected book: ${book.title} (ID: ${book.id})`); // Log selected book
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                prevIndex < results.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : results.length - 1
            );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            handleSelect(results[highlightedIndex]);
            setHighlightedIndex(-1);
        } else if (e.key === 'Tab' && highlightedIndex >= 0) {
            handleSelect(results[highlightedIndex]);
            setHighlightedIndex(-1);
        }
    };

    const handleCreateTodo = async () => {
        if (selectedBook && todo_title) {
            try {
                const response = await axios.post(create_todo_url, {
                    book_id: selectedBook.id,
                    book_title: selectedBook.title,
                    todo_title: todo_title}, {
                        headers: {
                            'Authorization': `Bearer ${create_todo_url_key}`
                        }
                    });

                
                setTodos((prevTodos) => [
                    ...prevTodos,
                    {
                        id: response.data.id,
                        todo_title: response.data.todo_title,
                        book: response.data.book,
                        completed: response.data.completed
                    }
                ]);

                settodo_Title('');
                setSelectedBook(null);
                setQuery('');
            } catch (error) {
                console.error("Error creating todo:", error);
            }
        }
    };

    const handleClearSelection = () => {
        if (selectedBook) {
            console.log(`Removed selection: ${selectedBook.title} (ID: ${selectedBook.id})`);
        }
        setSelectedBook(null);
        setQuery('');
    };

    const handleToggleCompletion = (id) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                placeholder="Search for a book"
            />
            <ul>
                {results.map((book, index) => (
                    <li
                        key={book.id || index} 
                        onClick={() => handleSelect(book)}
                        className={index === highlightedIndex ? 'highlight' : ''}
                    >
                        {book.title}
                    </li>
                ))}
            </ul>
            {selectedBook && (
                <div>
                    <h3>Selected Book: {selectedBook.title}</h3>
                    <input
                        type="text"
                        value={todo_title}
                        onChange={(e) => settodo_Title(e.target.value)}
                        placeholder="Enter a todo Title"
                    />
                    <button onClick={handleCreateTodo}>Add Todo</button>
                    <button onClick={handleClearSelection}>Clear Selection</button>
                </div>
            )}
            
            <div>
                <h3>Todo List</h3>
                <ul>
                    {todos.map((todo, index) => (
                        <li key={todo.id || index}>
                            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                {todo.todo_title} (Book: {todo.book})
                            </span>
                            <button onClick={() => handleToggleCompletion(todo.id)}>
                                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Autocomplete;
