import mongoose from 'mongoose'

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

}, { timestamps: true })

export default mongoose.model('notes', notesSchema)