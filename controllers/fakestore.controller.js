const FakeStore = require('../models/FakeStore');
const fakestoreapi = require('../models/fakestore.json');

/* 
    @route   GET api/fakestore
    @desc    Get all FakeStore
    @access  private 
*/
const getFakeStore = async (req, res) => {

    try {

        const fakestore = await FakeStore.find();
        if(fakestore.length > 0){
            data = res;
        }else{
            // seed data from json
            const fakestore_arr = fakestoreapi.map(api => {
                api['search'] = api.title.toLowerCase();
                return api
            });

            await FakeStore.insertMany(fakestore_arr);
        }

        res.json({ fakestore })

    } catch (err) {
        console.log(err)
    }
}

module.exports = { getFakeStore }; 