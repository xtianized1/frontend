import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTodo = () => {
    const [todoTitle, setTodoTitle] = useState('');
    const [todoDescription, setTodoDescription] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch the list of books when the component mounts
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/books/'); // Adjust the URL as per your backend
                setBooks(response.data);
            } catch (err) {
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (todoTitle && selectedBook) {
            try {
                const newTodo = {
                    title: todoTitle,
                    description: todoDescription,
                    book: selectedBook.id,
                };
                await axios.post('http://localhost:8000/api/todos/', newTodo);
                console.log('Todo created:', newTodo);
                // Optionally reset form after submission
                setTodoTitle('');
                setTodoDescription('');
                setSelectedBook(null);
            } catch (err) {
                console.error('Error creating todo:', err);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p><input
                type="text"
                placeholder="Todo Title"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
            /></p>
            <p><textarea
                placeholder="Todo Description"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
            /></p>
            <p><select
                onChange={(e) => setSelectedBook(books.find(book => book.id === parseInt(e.target.value)))}
                value={selectedBook ? selectedBook.id : ''}
            >
                <option value="">Select Book</option>
                {books.map((book) => (
                    <option key={book.id} value={book.id}>
                        {book.title}
                    </option>
                ))}
            </select></p>
            <button type="submit">Create Todo</button>
        </form>
    );
};

export default CreateTodo;
