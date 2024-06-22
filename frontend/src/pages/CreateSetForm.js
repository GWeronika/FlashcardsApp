import React, { useState, useEffect } from 'react';
import '../styles/CreateSetForm.css';
import Button from "../components/Button";

const CreateSetsForm = ({ isLoggedIn, currentUser, onRedirect }) => {
    const [setName, setSetName] = useState('');
    const [setDescription, setSetDescription] = useState('');
    const [newFlashcard, setNewFlashcard] = useState({
        word: '',
        description: '',
        isFavourite: false
    });
    const [flashcards, setFlashcards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            alert("To create a set, an account is required.");
            setTimeout(onRedirect, 500);
        }
    }, [isLoggedIn, onRedirect]);

    const handleSetNameChange = (e) => {
        setSetName(e.target.value);
    };

    const handleSetDescriptionChange = (e) => {
        const { value } = e.target;
        setSetDescription(value);
    };

    const handleSetWordChange = (e) => {
        const { value } = e.target;
        setNewFlashcard(prevState => ({
            ...prevState,
            word: value
        }));
    };

    const handleSetDefinitionChange = (e) => {
        const { value } = e.target;
        setNewFlashcard(prevState => ({
            ...prevState,
            description: value
        }));
    };

    const handleAddFlashcard = (e) => {
        e.preventDefault();
        setFlashcards([...flashcards, newFlashcard]);
        setNewFlashcard({ word: '', description: '', isFavourite: false });
    };

    const handleCreateSet = async () => {
        if (setName.trim() !== '' && setDescription.trim() !== '') {
            setIsModalOpen(false);
            const params = new URLSearchParams();
            params.append('name', setName);
            params.append('date', new Date().toISOString().split('T')[0]);
            params.append('description', setDescription);
            params.append('userJson', JSON.stringify(currentUser));

            try {
                const response = await fetch('/api/set/add/description', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: params.toString()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert("Set added successfully.");
            } catch (error) {
                alert(`Failed to add set: ${error.message}`);
            }
        }
    };

    const handleFlashcardClick = (index) => {
        console.log(`Clicked on flashcard ${index}`);
    };

    return (
        <div className="create-form-container">
            {isModalOpen && (
                <div className="modal">
                    <h2>Create new set</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={setName}
                        onChange={handleSetNameChange}
                    />
                    <textarea
                        placeholder="Description"
                        value={setDescription}
                        onChange={handleSetDescriptionChange}
                        rows={1}
                    />
                    <Button text={<>Create</>} onClick={handleCreateSet} />
                </div>
            )}
            {!isModalOpen && (
                <>
                    <div className="create-form-inner">
                        <div className="name-form">
                            <input
                                type="text"
                                placeholder="Set Name"
                                value={setName}
                                onChange={handleSetNameChange}
                            />
                            <textarea
                                placeholder="Description"
                                value={setDescription}
                                onChange={handleSetDescriptionChange}
                                rows={3}
                            />
                        </div>
                        <div className="create-form">
                            <input
                                type="text"
                                placeholder="Word"
                                value={newFlashcard.word}
                                onChange={handleSetWordChange}
                            />
                            <input
                                type="text"
                                placeholder="Definition"
                                value={newFlashcard.description}
                                onChange={handleSetDefinitionChange}
                            />
                            <Button text={<>Add</>} onClick={handleAddFlashcard} />
                        </div>
                    </div>
                    <div className="flashcard-container">
                        {flashcards.map((flashcard, index) => (
                            <button key={index} className="flashcard" onClick={() => handleFlashcardClick(index)}>
                                <h3 className="flashcard-title">{flashcard.word}</h3>
                                <p className="flashcard-description">{flashcard.description}</p>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateSetsForm;
