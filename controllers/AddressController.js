import addressItem from "../models/AddressModel.js"

//
const getAddresses = async (req, res) =>{
    const {email} = req.query;
    if (!email) {
        return res.status(400).json({ message: "Please enter email" });
    }

    try {
        const results = await addressItem.find({ email }).sort({ createdAt: -1 });
        res.status(200).json({address: results});
    } catch (error) {
        res.status(500).json({message: "Server error. Please try again later"});
    }
}

export { getAddresses }