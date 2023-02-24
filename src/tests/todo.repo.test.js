const { describe, test } = require('@jest/globals');
const mockingoose = require('mockingoose');

const { addTodo, findOne, delAll, delSingle, setDone } = require('../repository/todo.js');

const mockData = {
    uid: '5461319493',
    tasks: [
        {
            task: 'Note testowe zadanie',
            done: false,
            created: '1676312586'
        },
        {
            task: 'Drugie testowe zadanie',
            done: true,
            created: '1676312186'
        },
        {
            task: 'Lorem ipsum dolor sit trzecie',
            done: false,
            created: '1676311576'
        },
    ]
};

describe('Todo repo', () => {
    mockingoose.Todo.toReturn(mockData, 'findOne');

    describe('findOne', () => {
        test ('Should return the list of tasks', async () => {
            const result = await findOne(5461319493);
            expect(result[0]).toBe('[1] [todo] Note testowe zadanie');
        });
    });

    describe('delSingle success', () => {
        test ('Should delete single tasks', async () => {
            const result = await delSingle(5461319493, '/del 2');
            expect(result).toBe('Usunięto zadanie nr 2\n[1] [todo] Note testowe zadanie\n[2] [todo] Lorem ipsum dolor sit trzecie');
        });

        test ('Should return that wrong task number was provided', async () => {
            const result = await delSingle(5461319493, '/del 6');
            expect(result).toBe(`Błędny numer zadania, wybierz jedno z poniższych:
[1] [todo] Note testowe zadanie
[2] [done] Drugie testowe zadanie
[3] [todo] Lorem ipsum dolor sit trzecie`);
        });

        test ('Should return that there is no tasks', async () => {
            mockingoose.Todo.toReturn({}, 'findOne');
            const result = await delSingle(111, '/del 2');
            expect(result).toBe('Nie masz jeszcze zadnych zadań.\nWpisz /add tu_podaj_tresc_zadania');
        });
    });

    describe('setDone', () => {
        test ('Should return updated list of tasks', async () => {
            mockingoose.Todo.toReturn(mockData, 'findOne');
            const result = await setDone(5461319493, '/done 3');
            expect(result).toBe(`Zakończono zadanie nr 3
[1] [todo] Note testowe zadanie
[2] [done] Drugie testowe zadanie
[3] [done] Lorem ipsum dolor sit trzecie`);
        });
    });

    describe('delAll', () => {
        test ('Should delete all tasks', async () => {
            const result = await delAll(5461319493);
            expect(result).toBe('Usunięto wszystkie zadania');
        });
    });

    describe('create', () => {
        test ('Should update a tasks list', async () => {
            mockingoose.Todo.toReturn({
                uid: '5461319493',
                tasks: [
                    {
                        task: 'Dodaj kolejne testowe zadanie',
                        done: false,
                        created: '1676312586'
                    },
                ]
            }, 'findOneAndUpdate');
            const result = await addTodo(5461319493, 'Dodaj kolejne testowe zadanie', '1676312586');
            expect(result).toBe('Zadanie dodane! \n[1] [todo] Dodaj kolejne testowe zadanie');
        });

        test ('Should create a tasks list', async () => {
            mockingoose.Todo.toReturn({}, 'findOne');
            const result = await addTodo(5461319493, 'Dodaj kolejne testowe zadanie', '1676312586');
            expect(result).toBe('Zadanie dodane! \n[1] [todo] Dodaj kolejne testowe zadanie');
        });
    });
});