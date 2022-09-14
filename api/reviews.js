const express = require('express');
const reviewsRouter = express.Router();
const { requireLogin, requireAdmin } = require('./utils');

const {
  createReview,
  getReviewById,
  getReviewsByItemId,
  removeReview,
  getStarsByItemId,
  canEditReview,
  updateReview,
  addReviewToItem,
} = require('../db')

//api requests below

// get reviews for a item
reviewsRouter.get('/item/:itemId', async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const itemReviews = await getReviewsByItemId(itemId);

    res.send(itemReviews);
  } catch ({ name, message }) {
    next({ name, message })
  }
})


//post review
reviewsRouter.post('/', requireLogin, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId, stars, description } = req.body;
    
    const userReview = await createReview({ userId, itemId, stars, description });

    // will we need to return this?
    const reviewId = userReview.id;
    await addReviewToItem({ itemId, reviewId });

    res.send(userReview);
  } catch ({ name, message }) {
    next({ name, message })
  }
})

//Patch my Review 
reviewsRouter.patch('/:reviewId',requireLogin, async (req, res, next) => {
  const { reviewId } = req.params;
  const { ...fields } = req.body;

  try {
    const userId = req.user.id;
    const canEdit = await canEditReview({ userId, reviewId });

    if (canEdit) {
      const updatedReview = await updateReview({ id: reviewId, ...fields });

      res.send(updatedReview);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user.username} is not allowed to update this review `,
        "name": "UnauthorizedUserError"
      });
    }
    
  } catch ({ name, message }) {
    next({ name, message });
  }
})

//going to be delete review 
reviewsRouter.delete('/:reviewId',requireLogin, async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    const canEdit = await canEditReview({ userId, reviewId })
    if (canEdit) {
      const deletedReview = await removeReview(reviewId);

      res.send(deletedReview);
    }else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user.username} is not allowed to remove this review `,
        "name": "UnauthorizedUserError"
      });
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
})


module.exports = reviewsRouter;