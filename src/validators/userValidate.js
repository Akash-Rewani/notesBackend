import yup from 'yup'

export const userValidateSchema = yup.object({
    username: yup
        .string()
        .trim()
        .required(),

    email: yup
        .string()
        .email('It is not a email')
        .required(),

    password: yup
        .string()
        .required('enter password')
        .trim()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        )

})
export const userValidate = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body)
        next()
    } catch (err) {
        return res.status(500).json({ errors: err.errors })
    }
}