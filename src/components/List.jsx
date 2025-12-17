import Task from './Task';

export default function List({ list, updateList }) {
  return (
    <ul className="list">
      {list.map(({ title, id, isDone }) => (
        <Task id={id} key={id} title={title} isDone={isDone} updateList={updateList} />
      ))}
    </ul>
  );
}
