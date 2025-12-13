import notesSchema from "../models/notesSchema.js"

export const createNote = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Enter notes title and description'
            })
        }
        const notes = await notesSchema.create({
            title: title,
            description: description,
            userId: req.userId
        })
        console.log(notes);

        return res.status(201).json({
            success: true,
            message: 'Notes created Success',
            notes
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const updateNote = async (req, res) => {
    try {
        const { title, description } = req.body
        const notesId = req.params.id
        const userId = req.userId

        const data = await notesSchema.findOne({ _id: notesId, userId });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Notes not found or you are not authorized",
            });
        }

        data.title = title;
        data.description = description
        await data.save();

        return res.status(200).json({
            success: true,
            message: "Todo updated Successfully",
            data
        });


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
        const userId = req.userId

        const note = await notesSchema.findOneAndDelete({ _id: notesId, userId });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Todo not found or you are not authorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Note deleted Success",
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
        const notes = await notesSchema.find({
            userId: req.userId
        })
        if (!notes) {
            return res.status(400).json({
                success: false,
                message: 'Notes not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Notes Fetch sucess',
            notes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}