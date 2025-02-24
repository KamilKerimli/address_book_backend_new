import userItem from "../models/UserModel.js"
import addressItem from "../models/AddressModel.js"

//ok
const updateUserAndAddress = async (req, res) => {
    try {
        const { usernameNew, emailOld, emailNew, addressList } = req.body;

        const user = await userItem.findOne({ email: emailOld });

        const updatedUser = await userItem.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    email: emailNew !== emailOld ? emailNew : user.email, 
                    username: usernameNew !== user.username ? usernameNew : user.username
                }
            },
            { new: true, runValidators: true }
        );


        if (addressList) {
            for (let address of addressList) {
                const existAddress = await addressItem.findOne({ _id: address._id });
                if (existAddress) {
                    await addressItem.findByIdAndUpdate(address._id, { $set: address });
                } else {
                    const newAddress = new addressItem({
                        email: emailNew,
                        addressType: address.addressType,
                        shortAddress: address.shortAddress,
                        realAddress: address.realAddress,
                    });
                    await newAddress.save();
                }
            }
        }

        res.status(200).json({ message: "User all data changed successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
//ok
const getStatistics = async (req, res) =>{
    try {
        const usersSt = await getUserStatistic();
        const addressSt = await getAddressStatistic();
        
        const usersYearSt = await getUsersYearStatistic();
        const addressYearSt = await getAddressYearStatistic();
        
        res.status(200).json({ usersSt, addressSt, usersYearSt, addressYearSt });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
}

//private methods
const getUserStatistic = async () => {
    const currentDate = new Date();
    const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const firstDayTwoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);

    const userCounts = await userItem.aggregate([
        {
            $match: {
                createdAt: { $gte: firstDayTwoMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m", date: "$createdAt" } 
                },
                count: { $sum: 1 } 
            }
        },
        {
            $sort: { _id: 1 } 
        }
    ]);

    const result = {
        [firstDayTwoMonthsAgo.toLocaleString('en-US', { month: 'short' })]: 0,
        [firstDayLastMonth.toLocaleString('en-US', { month: 'short' })]: 0,
        [firstDayCurrentMonth.toLocaleString('en-US', { month: 'short' })]: 0,
    };

    userCounts.forEach(entry => {
        const dateParts = entry._id.split("-");
        const date = new Date(dateParts[0], dateParts[1] - 1, 1);
        const monthShort = date.toLocaleString('en-US', { month: 'short' });
        result[monthShort] = entry.count;
    });

    return result;
}
const getAddressStatistic = async () => {
    const currentDate = new Date();
    const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const firstDayTwoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    const lastDayTwoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);

    const addressCounts = await addressItem.aggregate([
        {
            $match: {
                createdAt: { $gte: firstDayTwoMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $and: [
                            { $gte: ["$createdAt", firstDayCurrentMonth] },
                            { $lt: ["$createdAt", new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)] }
                        ]}, 
                        "current",
                        {
                            $cond: [
                                { $and: [
                                    { $gte: ["$createdAt", firstDayLastMonth] },
                                    { $lte: ["$createdAt", lastDayLastMonth] }
                                ]},
                                "last",
                                "twoAgo"
                            ]
                        }
                    ]
                },
                count: { $sum: 1 }
            }
        }
    ]);

    const result = {
        [firstDayTwoMonthsAgo.toLocaleString('en-US', { month: 'short' })]: 0,
        [firstDayLastMonth.toLocaleString('en-US', { month: 'short' })]: 0,
        [firstDayCurrentMonth.toLocaleString('en-US', { month: 'short' })]: 0,
    };

    addressCounts.forEach(entry => {
        if (entry._id === "twoAgo") {
            result[firstDayTwoMonthsAgo.toLocaleString('en-US', { month: 'short' })] = entry.count;
        } else if (entry._id === "last") {
            result[firstDayLastMonth.toLocaleString('en-US', { month: 'short' })] = entry.count;
        } else if (entry._id === "current") {
            result[firstDayCurrentMonth.toLocaleString('en-US', { month: 'short' })] = entry.count;
        }
    });
    return result;
}
const getUsersYearStatistic = async() =>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const lastYear = currentYear - 1;
    const twoYearsAgo = currentYear - 2;

    const userCounts = await userItem.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(twoYearsAgo, 0, 1) } 
            }
        },
        {
            $group: {
                _id: { $year: "$createdAt" }, 
                count: { $sum: 1 } 
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const result = {
        [twoYearsAgo]: 0,
        [lastYear]: 0,
        [currentYear]: 0
    };

    userCounts.forEach(entry => {
        result[entry._id] = entry.count;
    });

    return result;
}
const getAddressYearStatistic = async() =>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const lastYear = currentYear - 1;
    const twoYearsAgo = currentYear - 2;

    const addressCounts = await addressItem.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(twoYearsAgo, 0, 1) } 
            }
        },
        {
            $group: {
                _id: { $year: "$createdAt" }, 
                count: { $sum: 1 }  
            }
        },
        {
            $sort: { _id: 1 }  
        }
    ]);

    const result = {
        [twoYearsAgo]: 0,
        [lastYear]: 0,
        [currentYear]: 0
    };

    addressCounts.forEach(entry => {
        result[entry._id] = entry.count;
    });

    return result;
}


export { updateUserAndAddress, getStatistics }