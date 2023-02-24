import { Router } from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import '../config/db.js';
import { addTodo, findOne, delAll, delSingle, setDone } from '../repository/todo.js'

dotenv.config();

const router = Router();
const telegram_token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegram_token, {polling: true});


router.get('/telegram', (req, res) => {
    console.log('test');
});

bot.onText(/\/start/, (msg) => {
    console.log(msg.text);
    bot.sendMessage(msg.chat.id, 'Wpisz: \n' +
    '<b>/list</b> aby wylistować swoje zadania \n' +
    '<b>/add tresc</b> aby dodać zadanie \n' + 
    '<b>/done numer-zadania</b> aby oznaczyć zadanie jako wykonane \n' + 
    '<b>/del numer-zadania</b> aby usunąć \n' +
    '<b>/del all</b> aby usunąć wszystkie',
    { parse_mode: 'HTML' }
    );
});

bot.onText(/\/list/, (msg) => {
    findOne(msg.chat.id, true).then(resp => {
        bot.sendMessage(msg.chat.id, resp, { parse_mode: 'HTML' });
    });
});

bot.onText(/\/add/, (msg) => {
    addTodo(msg.chat.id, msg.text, msg.date).then(resp => {
        bot.sendMessage(msg.chat.id, resp, { parse_mode: 'HTML' });
    })
});

bot.onText(/\/done/, (msg) => {
    setDone(msg.chat.id, msg.text).then(resp => {
        bot.sendMessage(msg.chat.id, resp, { parse_mode: 'HTML' });
    })
});

bot.onText(/\/del/, (msg) => {
    if(msg.text.includes('all')) {
        delAll(msg.chat.id).then(resp => {
            bot.sendMessage(msg.chat.id, resp);
        });
    } else {
        delSingle(msg.chat.id, msg.text).then(resp => {
            bot.sendMessage(msg.chat.id, resp);
        });
    }
});

export default router;