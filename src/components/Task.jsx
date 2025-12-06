export default function Task({title, isDone, id}){
    return(
        <li>
            <input type="checkbox" value={isDone}></input>
            <span>{title}</span>
            <button>📝</button>
            <button>❌</button>
        </li>
    )
}