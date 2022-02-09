const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    from_user: { type: String, required: false },
    to_user: { type: String, required: false },
    room: { type: String, required: false },
    message: { type: String, required: false },
    date_sent: { type: Date, default: Date.now, required: false }
});
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

