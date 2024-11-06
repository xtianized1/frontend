import React, { useState, useEffect } from 'react';
import axios from 'axios';
import booksData from '../assets/books.json';

const Autocomplete = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [todo_title, settodo_Title] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1); // For keyboard navigation
    const [todos, setTodos] = useState([]);  // State to hold todos

    // Fetch todos from the database
    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/todo_list/');
            setTodos(response.data);  // Update the state with fetched todos
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    useEffect(() => {
        fetchTodos();  // Fetch todos when the component mounts
    }, []);

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        
        if (searchQuery.length > 2) {
            // Filter books based on the search query
            const filteredBooks = booksData.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
    
            setResults(filteredBooks);  // Update the results with filtered books
            setHighlightedIndex(-1);    // Reset highlight
        } else {
            setResults([]);  // Clear results if query length is less than 3
        }
    };

    const handleSelect = (book) => {
        setSelectedBook(book);
        setQuery(book.title);  // Set input to selected book title
        setResults([]);         // Hide suggestions after selection
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
                const response = await axios.post('http://localhost:8000/api/todos/', {
                    book_id: selectedBook.id,
                    book_title: selectedBook.title,
                    todo_title: todo_title
                });

                // Add the new todo to the state (local todo list)
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
            console.log(`Removed selection: ${selectedBook.title} (ID: ${selectedBook.id})`); // Log removed book
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
                        key={book.id || index}  // Fallback to index if id is not available
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
            
            {/* Todo List */}
            <div>
                <h3>Todo List</h3>
                <ul>
                    {todos.map((todo, index) => (
                        <li key={todo.id || index}> {/* Use fallback index if id is missing */}
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
