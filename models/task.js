const mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    dueDate:{
        type:Date,
        default: Date.now
    },
    taskStatus: {
        type: String,
        enum: ['In Progress', "Complete",'Choose']
    },
    taskDescription: String
});
module.exports = mongoose.model('Task', taskSchema);