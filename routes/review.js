const express = require('express');
const route = express.Router({ mergeParams: true }); 
const reviews = require('../controllers/reviews');
const HelperFunction = require('../utils/helperFunctions');
const { isLoggedIn, checkAuthorReview , validateHelperReview  } = require('../middleware/middleware');

const helper = new HelperFunction();

// Routes
route.post('/', validateHelperReview, isLoggedIn, helper.asyncErrorHandler(reviews.postReview));

route.delete('/:reviewId', isLoggedIn, checkAuthorReview, helper.asyncErrorHandler(reviews.deleteReview));

module.exports = route;