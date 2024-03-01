const express = require('express');
const port = 3000;
const app = express();

app.use(express.json());

let array = [
    //empty array
];

function isValidString(str) {
    // Check if the string only contains characters (a-z, A-Z)
    let isOnlyChars = /^[A-Za-z]+$/.test(str);
  
    // Check if the string is a maximum of 30 characters long
    let isMax30Chars = str.length <= 30;
  
    // Return true if both conditions are met, false otherwise
    return isOnlyChars && isMax30Chars;
  }
  

app.get('/', (req, res) => {
    res.json('Welcome to internship\'s REST exercise!');
})

app.get('/api/flavors', (req, res) => {
    res.status(200).json(array);//give me all flavors
})

app.get('/api/flavors/:id', (req, res) => {//give me specific flavor
    const idFlavor = req.params.id;
    let podatak;
    podatak = array.filter(item => item.id == idFlavor);
    res.status(200).json(podatak);
})

app.put('/api/flavors/:id', (req, res) => {//update me specific flavor
    const idFlavor = req.params.id;
    const newFlavor = req.body.flavor;
    const newDescription = req.body.description;
    const newPrice = req.body.price;
    const newTags = req.body.tags;
    const newPopularity = req.body.popularity;
    if(!isValidString(newFlavor)){
        res.status(404).json({ error: 'Invalid charachters' });
    }
    if (!newFlavor) {
        res.status(404).json({ error: 'New flavor is required' });
    } else {
        array.forEach(item => {
            if (item.id == idFlavor) {
                item.flavor = newFlavor;
                item.description = newDescription;
                item.price = newPrice;
                item.tags = newTags;
                item.popularity = newPopularity;
                res.status(200).json(array);
            }
        });
        res.status(404).json({ error: 'Not found that id' });
    }
})

app.post('/api/flavors', (req, res) => {//add new flavor
    const idnewFlavor = array.length + 1;
    const newFlavor = req.body.flavor;
    const newDescription = req.body.description;
    const newPrice = req.body.price;
    const newTags = req.body.tags;
    const newPopularity = req.body.popularity;
    if(!isValidString(newFlavor)){
        res.status(404).json({ error: 'Invalid charachters' });
    }
    let exists = 0;
    if (!newFlavor) {
        res.status(404).json({ error: 'New flavor is required' });
    }
    array.forEach(item => {
        if (item.flavor == newFlavor) {
            exists = 1;
            res.status(404).json({ error: 'Already exists that flavor' });//cant add the same flavor
        }
    });
    if(exists == 0){
        array.push({ id: idnewFlavor, flavor: newFlavor, description: newDescription, price: newPrice, tags: newTags, popularity: newPopularity });
        res.status(201).json(array);
    }
})

app.delete('/api/flavors/:id', (req, res) => {//delete specific flavor
    const idFlavor = req.params.id;

    if (!idFlavor) {
        res.status(404).json({ error: 'Id is required' });
    } else {
        array = array.filter(item => item.id != idFlavor);
    }
    res.status(204).json(array);
})


const server = app.listen(port, () => {
    console.log('Server listening on port 3000');
});

module.exports = server;