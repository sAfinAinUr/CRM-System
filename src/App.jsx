import './App.css';
import AddTask from './components/AddTask';

import { useState, useEffect } from 'react';
import { getTaskList } from './http';
import List from './components/List';
import Menu from './components/Menu';

function App() {
  const [list, setList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState('all');
  const [listInfo, setListInfo] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchAllList() {
      setIsFetching(true);
      setError();
      try {
        const list = await getTaskList(selectedTasks);
        setList(list.data);
        setListInfo(list.info);
        setIsFetching(false);
      } catch (error) {
        setError({ message: error.message || 'Failed to fetch list' });
      }
    }
    fetchAllList();
  }, [selectedTasks]);
  function handleAddNewTask(task) {
    setList([...list, task]);
    setListInfo((prev) => {
      return {
        ...prev,
        all: prev.all + 1,
        inWork: prev.inWork + 1,
      };
    });
  }

  function handleAddEditTask(task) {
    const editList = list.map((item) => {
      if (task.id === item.id) {
        return task;
      }
      return item;
    });
    setList(editList);
  }

  function handleDeleteTask(id, isDone) {
    const editList = list.filter((item) => item.id != id);
    setList(editList);
    setListInfo((prev) => {
      return {
        all: prev.all - 1,
        completed: prev.completed - (isDone ? 1 : 0),
        inWork: prev.inWork - (isDone ? 0 : 1),
      };
    });
  }

  function handleClickSelectTasks(selectedButton) {
    setSelectedTasks(selectedButton);
  }

  function handleChangeIsDone(isDone, id) {
    const i = isDone ? 1 : -1;
    setListInfo((prev) => {
      return {
        ...prev,
        completed: prev.completed + i,
        inWork: prev.inWork - i,
      };
    });
    if (selectedTasks != 'all') {
      const editList = list.filter((item) => item.id != id);
      setList(editList);
    }
  }

  const functions = {
    edit: handleAddEditTask,
    delete: handleDeleteTask,
    chahgeIsDone: handleChangeIsDone,
  };
  return (
    <>
      <AddTask handleAddNewTask={handleAddNewTask} />
      <section className="content">
        <Menu listInfo={listInfo} handleClick={handleClickSelectTasks} isSelected={selectedTasks} />
        {error && <p>{error.message}</p>}
        {!error && isFetching ? <p>Loading...</p> : <List functions={functions} list={list} />}
      </section>
    </>
  );
}

export default App;
