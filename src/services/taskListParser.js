const prepareTasksToDpisplay = (todo) => {
    let tasks = [];
    todo.tasks.forEach(function (obj, key) {
        let status = '';
        if(obj.done) {
            status = '[done]';
        } else {
            status = '[todo]';
        }
        tasks.push( `[${key + 1}] ${status} ${obj.task}`);
    })
    return tasks;
}

export { prepareTasksToDpisplay }