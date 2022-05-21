const express = require('express');
const route = express.Router();
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, checkAuthor, validatorHelperCampground } = require('../middleware/middleware');
const HelperFunction = require('../utils/helperFunctions');
const helper = new HelperFunction();

// Routes
route.route('/')
	.post( isLoggedIn, validatorHelperCampground, helper.asyncErrorHandler(campgrounds.createCampground))
	.get(helper.asyncErrorHandler(campgrounds.index))

route.get('/new', isLoggedIn, campgrounds.getNewPage);

route.route('/:id')
.delete(isLoggedIn , checkAuthor ,helper.asyncErrorHandler(campgrounds.deleteCampground))
.put(isLoggedIn, checkAuthor ,helper.asyncErrorHandler(campgrounds.updateCampground))
.get(helper.asyncErrorHandler(campgrounds.getCampgroundPage))

route.get('/:id/edit', isLoggedIn, checkAuthor, helper.asyncErrorHandler(campgrounds.getEditPage));

module.exports = route;