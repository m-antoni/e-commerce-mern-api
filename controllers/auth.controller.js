const User = require('../models/User');
const { userSchema, authSchema } = require('../helpers/validation.helper');

/* 
    @route   POST api/auth/register
    @desc    Register User
    @access  public 
*/
const register = async (req, res) => {

    const error_msg = [];
    const params = req.body;

    const { error } = userSchema.validate(params, { abortEarly: false });

    if(error) {
        error.details.map(err => error_msg.push(err.message))
        return res.status(404).json({ errors: error_msg });
    }
    
    const emailExists = await User.findOne({ email: params.email });
    if(emailExists) {
        error_msg.push(`${params.email} is already taken`);
        return res.status(400).json({ errors: error_msg });
    }

    try {

        const user = new User(params);
        await user.save();
        const token = await user.generateAuthToken();

        res.json({ token, redirect: '/' });

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
}



/* 
    @route   POST api/auth/login
    @desc    Authenticate User
    @access  public 
*/
const login = async (req, res) => {
    
    const error_msg = [];
    const params = req.body;

    const { error } = authSchema.validate(params, { abortEarly: false });

    if(error){
        error.details.map(err => error_msg.push(err.message));
        return res.status(400).json({ errors: error_msg });
    }

    try {

        const user = await User.findByCredentials(params.email, params.password);

        if(user == 401){
            error_msg.push('Incorrect email or password.')
            return res.status(400).json({ errors: error_msg });
        }

        const token = await user.generateAuthToken();

        res.json({ token, redirect: '/' });

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }  
}


module.exports =  { register, login };