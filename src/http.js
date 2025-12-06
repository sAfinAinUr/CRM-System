export async function addNewTask(title){
    const response = await fetch('https://easydev.club/api/v1/todos', {
        method: 'POST',
        body: JSON.stringify({title}),
        headers: {
            'Content-Type' : 'application/json' 
        }
    });


    if(!response.ok){
        throw new Error('Failed to add new task.')
    }

    return response.json();

}

export async function getAllTaskList(){
    const response = await fetch('https://easydev.club/api/v1/todos?filter=all', {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json' 
        }
    });

    const resData = await response.json();

    return resData.data;
} 

export async function getInWorkTaskList(){
    const response = await fetch('https://easydev.club/api/v1/todos?filter=inWork', {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json' 
        }
    });
} 

export async function getComplitedTaskList(){
    const response = await fetch('https://easydev.club/api/v1/todos?filter=complited', {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json' 
        }
    });
} 