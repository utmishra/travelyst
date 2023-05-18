const express = require('express');
const app = express();
const mainRoutes = require('./endpoints/main.js');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', mainRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server running...'));
