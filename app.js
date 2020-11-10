const express = require('express');
let fs = require('fs');
const app = express();


app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));




