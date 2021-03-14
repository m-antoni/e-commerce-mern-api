const User = require('../models/User');
const FakeStore = require('../models/FakeStore');
const { userSchema, authSchema } = require('../helpers/validation.helper');
const fakestoredata = require('../models/fakestore.json');
/* 
    @route   GET api/auth/verify
    @desc    Verify A User's Token if valid or expired
    @access  public 
*/
const authVerify = async (req, res) => {
    
    const fakestore = await setFakeStoreAPI();
    // This means token verify is success
    const data = {
        user: req.user,
        id: req.authID,
        token: req.token,
        fakestore
    }

    res.json(data);
}

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

        const data = await user.generateAuthToken();
        const fakestore = await setFakeStoreAPI();

        res.json({  user: data.user, id: data.id, token: data.token, fakestore, redirect: '/home'});

    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Server Error'});
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

        const data = await user.generateAuthToken();
        const fakestore = await setFakeStoreAPI();
            
        res.json({ user: data.user, id: data.id, token: data.token, fakestore, redirect: '/home'});

    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Server Error'});
    }  
}



const setFakeStoreAPI = async () => {

    let data = null;

    try {
        
        const res = await FakeStore.find();

        if(res.length > 0){
            data = res;
        }else{
            const fakestore_arr = fakestoredata.map(api => {
                api['search'] = api.title.toLowerCase();
                return api
            });

            await FakeStore.insertMany(fakestore_arr);
            data = fakestore_arr;
        }

    } catch (err) {
        console.log(err)
    }

    return data;
}


module.exports =  { register, login, authVerify };