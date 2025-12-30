import notesSchema from "../models/notesSchema.js"

export const createNote = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Enter Notes Title And Description'
            })
        }
        const notes = await notesSchema.create({
            title: title,
            description: description,
        })

        return res.status(201).json({
            success: true,
            message: 'Notes Created Success',
            notes
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const deleteNote = async (req, res) => {
    try {
        const notesId = req.params.id
       

        const note = await notesSchema.findOneAndDelete({ _id: notesId});

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Todo Not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Note Deleted Success",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const notes = await notesSchema.find().sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: 'Notes Fetched Successfully',
            notes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
