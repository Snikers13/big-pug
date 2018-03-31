const express = require('express');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');


let app = express();
let courses = require("./data/courses.json");


app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.get('/', (req, res) => {
	res.render('index', {title : 'API' });
})


app.get('/api/about', (req, res) => {
	res.render('about', {title: 'About'});
})

app.get('/api/contact', (req, res) => {
	res.render('contact', {title: 'Contact'})
})

app.get('/api/contact/send', (req, res) => {
	res.render('send');
})

app.post('/api/contact/send', (req, res) => {

	let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
              user: 'for.anton.tretyak@gmail.com',
              pass: 'T0938162653'
          }
      });
	let mailOptions = {
          from: '"Candidate" <candidate@gmail.com>', // sender address
          to: 'for.anton.tretyak@gmail.com', // list of receivers
          subject: 'Letter for Big Pug', // Subject line
          text: req.body.name + '\n' + req.body.phone + '\n' + req.body.email + '\n' + req.body.textarea // plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('contact');
          });
      
      res.redirect('/api/contact');

});

app.get('/api/courses', (req, res) => {
	res.render('courses', {
		title: 'Api Courses',
		courses: courses
	});
});

app.get('/api/courses/add', (req, res) => {
	res.render('add');
})

app.post('/api/courses/add', (req, res) => {
	let course = {
		name: req.body.name,
		id: Date.now()
	};

	courses.push(course);

	res.redirect('/api/courses');
})

app.get('/api/courses/edit/:id', (req, res) => {
	let course = courses.find( course => {
		return course.id === +req.params.id;
	});

	if (!course) {
		res.sendStatus(404);
		return;
	}

	res.render('edit', { course: course });

})

app.post('/api/courses/edit/:id', (req, res) => {
	let course = courses.find( course => {
		return course.id === Number(req.params.id);
	})

	if(!course) {
		res.sendStatus(404);
		return;
	}

	course.name = req.body.name;

	res.redirect('/api/courses');
})

app.get('/api/courses/delete/:id', (req, res) => {
	courses = courses.filter( course => {
		return course.id !== Number(req.params.id);
	})

	res.redirect('/api/courses');
})

app.listen(3000, () => {
	console.log('Go to local:3000')
});

