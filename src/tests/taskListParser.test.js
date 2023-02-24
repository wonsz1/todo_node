const { describe, test } = require('@jest/globals');
const { prepareTasksToDpisplay } = require('../services/taskListParser.js');
const mockingoose = require('mockingoose');
import Todo from '../models/todo.js';

describe('prepareTasksToDpisplay', () => {
    test('success', async () => {
        mockingoose.Todo.toReturn({
            uid: '123456789',
            tasks: [
                {
                    "done": false,
                    "task": "task 1",
                    "date": 1630810511,
                    "_id": "6135a5f5e5e6c3c3f0d6f3b6"
                },
                {
                    "done": true,
                    "task": "task 2",
                    "date": 1630810511,
                    "_id": "6135a5f5e5e6c3c3f0d6f3b7"
                },
                {
                    "done": false,
                    "task": "task 3",
                    "date": 1630810511,
                    "_id": "6135a5f5e5e6c3c3f0d6f3b8"
                },
                {
                    "done": false,
                    "task": "task 4",
                    "date": 1630810511,
                    "_id": "6135a5f5e5e6c3c3f0d6f3b9"
                }
            ]
        }, 'findOne');

        const todo = await Todo.findOne({ uid: '123456789' });
        const result = prepareTasksToDpisplay(todo);
        const expected = [
            '[1] [todo] task 1',
            '[2] [done] task 2',
            '[3] [todo] task 3',
            '[4] [todo] task 4',
        ];

        expect(result).toStrictEqual(expected);
    });
});