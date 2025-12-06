import './App.css'
import AddTask from './components/addTask'

import { useState, useEffect} from 'react'
import { getAllTaskList } from './http'
import List from './components/List'

function App() {
  const [list, setList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchAllList() {
      setIsFetching(true);
      setError();
      try {
        const list = await getAllTaskList();
        setList(list);
        setIsFetching(false);
      } catch (error) {
        setError({ message: error.message || 'Failed to fetch list' })
      }
    }
    fetchAllList();
  }, [])

  function handleAddNewTask(task){
    setList([...list, task]);
  }

  return (
    <>
      <AddTask handleAddNewTask={handleAddNewTask}/>
      {error && <p>{error.message}</p>}
      {!error && isFetching ? <p>Loading...</p> : <List list={list} />}
    </>
  )
}

export default App
