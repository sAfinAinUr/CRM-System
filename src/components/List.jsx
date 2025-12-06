import Task from './Task';

export default function List({ list }) {
    return (
        <ul>
            {list.map(({ title, id, isDone }) => <Task id={id} key={id} title={title} isDone={isDone}/>)}
        </ul>
    )
}
