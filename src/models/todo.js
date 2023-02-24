import mongoose from 'mongoose';

//https://mongoosejs.com/docs/schematypes.html#string-validators
const TodoSchema = mongoose.Schema({
    uid: {
        type: String
    },
    tasks: [{
        task: {
            type: String,
            minLength: [3, "Za którka treść, podaj min. 3 znaki"],
            maxLength: [255, "Za długa treść, podaj max. 255 znaki"]
        },
        done: {
            type: Boolean,
        },
        created: {
            type: Date
        }
    }]
})

export default mongoose.model('Todo', TodoSchema);