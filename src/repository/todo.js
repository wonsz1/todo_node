import Todo from '../models/todo.js';
import { prepareTasksToDpisplay } from '../services/taskListParser.js';

const noTasksMessage = 'Nie masz jeszcze zadnych zadań.\nWpisz /add tu_podaj_tresc_zadania';

const addTodo = async (uId, text, date) => {
    const task = text.replace('\/add ', '');
    try {
        let todo = await Todo.findOne({ uid: uId });
        if(todo && todo.tasks.length > 0) {
            const result = await updateTodo(uId, task, date);
            return 'Zadanie dodane! \n' + prepareTasksToDpisplay(result).join('\n');
        } else {
            const result = await createTodo(uId, task, date);
            return 'Zadanie dodane! \n' + prepareTasksToDpisplay(result).join('\n');
        }
    } catch(error) {
        console.log(error);
        return 'Błąd zapisu danych!';
    }
}

const createTodo = async (uId, task, date) => {
    try {
        const newTodo = new Todo({
            uid: uId,
            tasks: [{
                task: task,
                done: false,
                date: date
            }]
        })
        return await newTodo.save();
        //return newTodo;
    } catch(error) {
        console.log(error);
        return 'Błąd zapisu danych createTodo!';
    }
}

const updateTodo = async (uId, task, date) => {
    try {
        return await Todo.findOneAndUpdate(
            { uid: uId },
            {
                $push: {
                    tasks: {
                        task: task,
                        done: false,
                        date: date
                    }  
                }
            },
            {
                new: true,
                runValidators: true,
            }
        );
    } catch(error) {
        console.log(error);
        return 'Błąd zapisu danych updateTodo!';
    }
}

const findOne = async (chatId, format = false) => {
    try {
        const todo = await Todo.findOne({ uid: chatId });

        if(!todo || todo.tasks.length < 1) {
            return noTasksMessage;
        }

        if(format) {
            return prepareTasksToDpisplay(todo).join('\n');
        } else {
            return prepareTasksToDpisplay(todo);
        }
    } catch(error) {
        console.log(error);
        return 'Błąd odczytu danych!';
    }
}

const setDone = async (uId, text) => {
    const taskNr = parseInt(text.replace('\/done ', ''));

    try {
        const todo = await Todo.findOne({ uid: uId });

        if(!todo || todo.tasks.length < 1) {
            return noTasksMessage;
        }

        let tasks = [];
        todo.tasks.forEach(function (obj, key) {
            if(key + 1 === taskNr) {
                obj.done = true;
            }
            
            let status = '';
            if(obj.done) {
                status = '[done]';
            } else {
                status = '[todo]';
            }
            tasks.push( `[${key + 1}] ${status} ${obj.task}`);
        });

        await Todo.findOneAndUpdate(
            { uid: uId },
            {
                tasks: todo.tasks
            },
        );
        
        return `Zakończono zadanie nr ${taskNr}\n` + prepareTasksToDpisplay(todo).join('\n');
    } catch(error) {
        console.log(error);
        return 'Błąd odczytu danych!';
    }

}

const delAll = async (uId) => {
    await Todo.findOneAndDelete({uid: uId});
    return 'Usunięto wszystkie zadania';
}

const delSingle = async (uId, task) => {
    try {
        const todo = await Todo.findOne({ uid: uId });

        if(todo.tasks.length < 1) {
            return noTasksMessage;
        }

        const taskNr = task.replace( /^\D+/g, '');
        let taskRemoved = false;

        todo.tasks.forEach(function (obj, key) {
            if(key + 1 === parseInt(taskNr)) {
                todo.tasks.splice(key, 1);
                taskRemoved = true;
            }
        });

        if(taskRemoved) {
            await todo.save();
            return `Usunięto zadanie nr ${taskNr}\n` + prepareTasksToDpisplay(todo).join('\n');
        } else {
            return 'Błędny numer zadania, wybierz jedno z poniższych:\n' + prepareTasksToDpisplay(todo).join('\n');
        }
        
    } catch(error) {
        console.log(error);
        return 'Błąd odczytu danych!';
    }
}

export { addTodo, findOne, delAll, delSingle, setDone };