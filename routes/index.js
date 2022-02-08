const router = require("express").Router();
const Celebrity = require('../models/Celebrity')
const Movies = require('../models/Movies.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get('/celebreties', (req, res, next) => {
	// get all the books from the db
	Celebrity.find()
		.then(celebetiesFromDB => {
			console.log(celebetiesFromDB)
			// render a view
			res.render('celebreties/index', { celebreties: celebetiesFromDB })
		})
		.catch(err => next(err))
	// render a view and display the titles
})

router.get('/celebreties/add', (req, res, next) => {
	res.render('celebreties/add')
});

router.get('/celebreties/:id', (req, res, next) => {
	// retrieve that book from the db
	const id = req.params.id
	const celebrity = Celebrity.findById(id)
	const movies = Movies.find()
	//console.log(id)
	Promise.all([celebrity, movies]).then(data => {
		const [celebrity, movies] = data
		let moviesIncludingCelebrity = []
		movies.forEach(movie => {
	    	if (movie.cast.includes(id)) {
				console.log('test: ', movie.cast)
				moviesIncludingCelebrity.push(movie)	
			}
		})
		//console.log('test: ', movies)
		res.render('celebreties/detail', { celebrity, moviesIncludingCelebrity })
	})
	// Celebrity.findById(id)
	// 	.then(celebetiesFromDB => {
	// 		console.log(celebetiesFromDB)
	// 		res.render('celebreties/detail', { celebrety: celebetiesFromDB })
	// 	})
		.catch(err => next(err))
})

router.post('/celebreties', (req, res, next) => {
	// get the values from request body	
	// console.log(req.body)
	const { name, age } = req.body
	// create a new book in the db
	Celebrity.create({ name, age })
		.then(createdCelebrety => {
			console.log(createdCelebrety)
			// res.render('books/detail', { book: createdCelebrety })
			// redirect to the detail view of that book
			res.redirect(`/celebreties/${createdCelebrety._id}`)
		})
		.catch(err => next(err))
});

router.get('/celebreties/edit/:id', (req, res, next) => {
	// get that book from the db	
	const id = req.params.id
	Celebrity.findById(id)
		.then(celebetiesFromDB => {
			res.render('celebreties/edit', { celebrety: celebetiesFromDB })
		})
		.catch(err => next(err))
});

router.post('/celebreties/update/:id', (req, res, next) => {
	const { name, age } = req.body
	// by passing {new true} as a third param findByIdAndUpdate returns 
	// the updated book
	Celebrity.findByIdAndUpdate(req.params.id, {
		name,
		age
	}, { new: true })
		.then(updatedCelebreties => {
			console.log(updatedCelebreties)
			res.redirect(`/celebreties/${updatedCelebreties._id}`)
		})
});

router.get('/celebreties/delete/:id', (req, res, next) => {
	const id = req.params.id
	Celebrity.findByIdAndDelete(id)
		.then(deletedCelebrety => {
			console.log(deletedCelebrety)
			res.redirect('/celebreties')
		})
		.catch(err => next(err))
});

// router.get('/movies', (req, res, next) => {
// 	res.render('movies/index')
// });

router.get('/movies', (req, res, next) => {
	// get all the books from the db
	Movies.find()
		.then(moviesFromDB => {
			console.log(moviesFromDB)
			// render a view
			res.render('movies/index', { movies: moviesFromDB })
		})
		.catch(err => next(err))
	// render a view and display the titles
})

router.get('/movies/add', (req, res, next) => {
	Celebrity.find()
	.then(celebetiesFromDB => {
		res.render('movies/add', {celebreties: celebetiesFromDB})
	})
	.catch(err => next(err))
	
});

router.get('/movies/:id', (req, res, next) => {
	// retrieve that book from the db
	const id = req.params.id
	console.log(id)
	Movies.findById(id).populate('cast')
		.then(moviesFromDB => {
			console.log(moviesFromDB)
			res.render('movies/detail', { movies: moviesFromDB })
		})
		.catch(err => next(err))
})

router.post('/movies', (req, res, next) => {	
	const { title, genre, plot, cast } = req.body	
	Movies.create({ title, genre, plot, cast })
		.then(createdMovie => {
			console.log(createdMovie)			
			res.redirect(`/movies/${createdMovie._id}`)
		})
		.catch(err => next(err))
})

router.get('/movies/edit/:id', (req, res, next) => {
	const id = req.params.id
	const movie = Movies.findById(id).populate('cast')
	const celebrities = Celebrity.find()

	// get that book from the db	
	Promise.all([movie, celebrities]).then(data => {
		const [movie, celebrities] = data
		console.log(movie, celebrities)
		res.render('movies/edit', { movie, celebrities })
	})
	.catch(err => next(err))
});

router.post('/movies/update/:id', (req, res, next) => {
	const { title, genre, plot, cast } = req.body
	// by passing {new true} as a third param findByIdAndUpdate returns 
	
	Movies.findByIdAndUpdate(req.params.id, {
		title,
		genre,
		plot,
		cast
	}, { new: true })
		.then(updatedMovie => {
			console.log(updatedMovie)
			res.redirect(`/movies/${updatedMovie._id}`)
		})
});

router.get('/movies/delete/:id', (req, res, next) => {
	const id = req.params.id
	Movies.findByIdAndDelete(id)
		.then(deletedMovie => {
			console.log(deletedMovie)
			res.redirect('/movies')
		})
		.catch(err => next(err))
});

module.exports = router;
