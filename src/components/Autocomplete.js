import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken } from '../auth';

const Autocomplete = () => {
    const API_Url = process.env.DJANGO_API_URL || "https://backend-production-207b.up.railway.app/api/";
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [todo_title, settodo_Title] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1); 
    const [todos, setTodos] = useState([]); 

    const fetchTodos = async () => {
        try {
            const token = getAuthToken();
            if (token) {
                const response = await axios.get(`${API_Url}user-todos/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setTodos(response.data);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);  // Adding an empty dependency array to run only once

    
    const handleSearch = async (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        
        if (searchQuery.length > 2) {
            try {
                const response = await axios.get(`${API_Url}books/?query=${searchQuery}`);
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        } else {
            setResults([]);
        }
    };

    const handleSelect = (book) => {
        setSelectedBook(book);
        setQuery(book.title);  
        setResults([]);        
        console.log(`Selected book: ${book.title} (ID: ${book.id})`);
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
        }
    };

    const handleCreateTodo = async () => {
        if (selectedBook && todo_title) {
            try {
                const token = getAuthToken();
                const response = await axios.post(`${API_Url}todos/`, {
                    book_id: selectedBook.id,
                    book_title: selectedBook.title,
                    todo_title: todo_title}, {
                        headers: {
                            'Authorization': `Token ${token}`
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

    const handleDeleteTodo = async (todo_id) => {
        try {
            const token = getAuthToken();
            await axios.delete(`${API_Url}delete-todos/${todo_id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            fetchTodos();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleToggleCompletion = async (todo_id) => {
        try {
            const token = getAuthToken();
            await axios.post(`${API_Url}mark-todos/${todo_id}/`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === todo_id ? { ...todo, completed: !todo.completed } : todo
                )
            );
        } catch (error) {
            console.error("Error updating todo:", error);
        }
        
    };

    const handleClearSelection = () => {
        if (selectedBook) {
            console.log(`Removed selection: ${selectedBook.title} (ID: ${selectedBook.id})`);
        }
        setSelectedBook(null);
        setQuery('');
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
                            <button onClick={() => handleDeleteTodo(todo.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Autocomplete;
