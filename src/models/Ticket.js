import moongose from 'mongoose';

const ticketSchema = new moongose.Schema({
    code: {
        type: String,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: Number,
    purchaser: String
});

const Ticket = moongose.model('Ticket', ticketSchema);

export default Ticket;