import express from 'express';
import mainRoutes from './endpoints/main.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', mainRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server running...'));
