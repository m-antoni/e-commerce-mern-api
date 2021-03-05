const Shipping = require('../models/Shipping');


/* 
    @route   GET api/shipping
    @desc    Get all Shipping
    @access  private 
*/
const userShipping = async (req, res) => {

    try {
        
        let shipping = await Shipping.findOne({ user_id: req.authID }).select('-user_id');

        res.json({ shipping });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.')
    }
}


/* 
    @route   POS api/shipping
    @desc    Add Shiping
    @access  private 
*/
const addShipping = async (req, res) => {
    
    const { forms } = req.body;
    const authID = req.authID;
    
    try {
        
        let ship = await Shipping.findOne({ user_id: authID });

        if(ship){

            forms.map((form, i) => ship.details.push(forms[i]));
            await ship.save();

        }else{
            
            // Insert new shipping details
            const insertData = {
                user_id: authID,
                details: forms
            }
    
            ship = new Shipping(insertData);
            await ship.save();
        }
    
        res.json(ship); 

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.')
    }

}


/* 
    @route   PUT api/shipping/:detail_id
    @desc    Update specific details
    @access  private 
*/
const updateShipping = async (req, res) => {

    const { address, contact } = req.body;
    const detail_id = req.params.detail_id;
    const authID = req.authID;

    try {
        
        let ship = await Shipping.findOne({ user_id: authID });

        ship.details.map(detail => {
            if(detail._id.toString() === detail_id)
            {
                if(address){
                    detail.address = address;
                }

                if(contact){
                    detail.contact = contact;
                }
            }
        });

        await ship.save();
        res.json(ship);

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
}


/* 
    @route   DELETE api/shipping/:detail_id
    @desc    Delete specific detail
    @access  private 
*/
const removeDetail = async (req, res) => {

    const detail_id = req.params.detail_id;
    const authID = req.authID;

    try {
        
        let ship = await Shipping.findOne({ user_id: authID });

        let removeDetail = ship.details.filter(detail => detail._id.toString() !== detail_id);

        ship.details = removeDetail;
        
        await ship.save();

        res.json(ship);

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
}


/* 
    @route   PUT api/shipping/status/:detail_id
    @desc    Update default status of detail
    @access  private 
*/
const updateDefault = async (req, res) => {
    
    const detail_id = req.params.detail_id;
    const authID = req.authID;

    try {
        
        let ship = await Shipping.findOne({ user_id: authID });

        ship.details.map(detail => {
            if(detail._id.toString() === detail_id)
            {
                detail.is_default = true;

            }else
            {
                detail.is_default = false;
            }
        })

        await ship.save();
        res.json(ship);

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
}


module.exports = { userShipping, addShipping, updateShipping, removeDetail, updateDefault }; 