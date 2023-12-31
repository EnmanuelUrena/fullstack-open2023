import { useState, useEffect } from "react";
import {
  createPerson,
  getAll,
  deletePerson,
  updatePerson,
} from "./services/persons";

import "./index.css"


const Filter = ({ filter, handleFilter }) => (
  <div>
    filter show with a <input value={filter} onChange={handleFilter} />
  </div>
);

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Form = ({
  handleFormSubmit,
  newName,
  handleNewName,
  newNumber,
  handleNewNumber,
}) => (
  <form onSubmit={handleFormSubmit}>
    <div>
      name: <input value={newName} onChange={handleNewName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNewNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map(({ name, number, id }) => (
      <div key={id}>
        {name} {number} <button onClick={() => handleDelete(id)}>delete</button>
      </div>
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const filteredPersons =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const findPerson = persons.find((p) => p.name === newName);

    if (findPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updatePerson(findPerson.id, newPerson).then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== findPerson.id ? p : returnedPerson))
          );
          setNewName("");
          setNewNumber("");
        })
        .catch(error => {
          setErrorMessage(`Information of ${findPerson.name} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    } else {
      createPerson(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`Added ${newPerson.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  };

  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (confirmDelete) {
      deletePerson(id);
      const newPersons = persons.filter((person) => person.id !== id);
      setPersons(newPersons);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} className={"success"}/>
      <Notification message={errorMessage} className={"error"}/>
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add a new</h2>
      <Form
        handleFormSubmit={handleFormSubmit}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
