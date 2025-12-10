import Task from './Task';

export default function List({ list, functions }) {
  return (
    <ul>
      {list.map(({ title, id, isDone }) => (
        <Task functions={functions} id={id} key={id} title={title} isDone={isDone} />
      ))}
    </ul>
  );
}
