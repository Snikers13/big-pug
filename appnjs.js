const nunjucks = require('nunjucks');
const express = require('express');
let app = express();

app.get('/api/nunjucks', (req, res) => {
	nunjucks.configure('views', {
  autoescape: true,
  express   : app
});
	res.render('page.njk', { dinner: 'Pizza' })
})

app.listen(3000, () => {
	console.log('Go to local:3000')
});