const User = require("../models/User")
const Income = require("../models/Income")

// Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id

    try{
        const {icon, source, amount, date} = req.body;

        // Validation: Check for missing data
        if(!source || !amount || !date){
            return res.status(400).json({message: "All fields are required"});
        }

        const newIncome = new Income({
            userId,
            icon, 
            source, 
            amount, 
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);

    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

// Get All Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id

    try{
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income)
    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id; 

    try{
        await Income.findByIdAndDelete(req.params.id)
        res.json({message: "Income deleted successfully"})
    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({userId}).sort({date: -1});

        // Prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

