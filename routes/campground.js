const express = require('express');
const route = express.Router();
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, checkAuthor, validatorHelperCampground } = require('../middleware/middleware');
const HelperFunction = require('../utils/helperFunctions');
const helper = new HelperFunction();
//multer is a middleware where it will work with enctype='multipart/form-data'
//simply it will add a body object(contains text fields of form) and a file/s object(contains the files data) to the request object
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// Routes
route.route('/')
	.post(isLoggedIn, upload.array('image'), validatorHelperCampground, helper.asyncErrorHandler(campgrounds.createCampground))
	.get(helper.asyncErrorHandler(campgrounds.index))

route.get('/new', isLoggedIn, campgrounds.getNewPage);

route.route('/:id')
.delete(isLoggedIn , checkAuthor ,helper.asyncErrorHandler(campgrounds.deleteCampground))
.put(isLoggedIn, checkAuthor ,helper.asyncErrorHandler(campgrounds.updateCampground))
.get(helper.asyncErrorHandler(campgrounds.getCampgroundPage))

route.get('/:id/edit', isLoggedIn, checkAuthor, helper.asyncErrorHandler(campgrounds.getEditPage));

module.exports = route;