const express = require('express');
const router = express.Router();


const Items = require('../models/items');

router.get('/', async (req, res) => {
   operation = req.query.operation;
   console.log(operation)

    if(operation == undefined){
        res.render("items")
    }
    else if(operation == "fetchNames"){
        res.json(await Items.find({}, {name : 1, id : 1}).sort({ name: 1 }));
    }
    else if(operation == "fetchItem"){
        let item;
        try {
            item = await Items.findById(req.query.id);
            if (item == null) {
                //404 is a user error, they asked for something that doesn't exist
                return res.status(404).json({ message: 'Cannot find Item' });
            }
        } catch (err) {
            //500 is a server error, db has an error nothing to do will user or client
            return res.status(500).json({ message: err.message });
        }
        res.json(item);
    }
    else if(operation == "test"){
        res.json({message: "test success"});
    }else{
        console.log(operation)
        res.json({message: "Operation not supported"});
    }
    
});

//6458c5351a205186008d182d

router.get('/:id', getItemID, (req, res) => {
    res.send(res.item)
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const item = new Items({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            ageRequirement : req.body.ageRequirement,
            quantity : req.body.quantity
        });

        console.log(item)

        const newItem = await item.save();
        //201 is a success, something was created
        res.status(201).json(newItem);
    } catch (err) {
        //400 is a user error, they sent in bad data
        res.status(400).json({ message: err.message });
    }

});

router.patch('/', async (req, res) => {
    try{
        const id = req.body.id;
        const newItemValues = req.body.newItemValues;

        newValues = {}

        for(let i = 0; i < newItemValues.length; i++){
            newValues[newItemValues[i].key] = newItemValues[i].value;
        }

        console.log(newValues)

        let item = await Items.findById(id);
        if(item == null){
            return res.status(404).json({ message: 'Cannot find Item' });
        }
        
        await Items.updateOne(
            { _id: id },
            { $set: newValues }
        )

        res.json({ message: 'Updated Item' });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/', async (req, res) => {
    console.log(req.body.operation)
    if(req.body.operation == "deleteSingle"){
        try {
            await Items.findById(req.body.id).deleteOne();
            res.json({ message: 'Deleted Subscriber' });
        }  catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    else if(req.body.operation == "deleteAll"){
        try {
            await Items.deleteMany({});
            res.json({ message: 'Deleted All Subscribers' });
        }  catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    else{
        res.json({ message: 'Operation not supported' });
    }
    
});

async function getItemID(req, res, next) {
    let item;
    try {
        item = await Items.findById(req.params.id);
        if (item == null) {
            //404 is a user error, they asked for something that doesn't exist
            return res.status(404).json({ message: 'Cannot find Item' });
        }
    } catch (err) {
        //500 is a server error, db has an error nothing to do will user or client
        return res.status(500).json({ message: err.message });
    }

    //can call res.subscriber in other functions
    res.item = item;
    next();
}

module.exports = router;