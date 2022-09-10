const express = require('express');
const reviewsRouter = express.Router();
const { requireLogin, requireAdmin } = require('./utils');

const {
  createReview,
  getReviewById,
  // getReviewByItemId,
  // getReviewByUserId,
  // removeReview,
  // getStarsByItemId,
  canEditReview,
  updateReview,
} = require('../db')

//api requests below

//get get single items reviews 
// TODO: make way to add reviews to inventory item like we did
// with attaching activities to routines

// reviewsRouter.get('/inventory/:inventoryId', async (req, res, next) => {
//   try {
//     const { inventoryId } = req.params;
//     const itemReview = await getReviewByItemId(inventoryId);

//     res.send(itemReview);
//   } catch (error) {
//     throw error
//   }
// })

//post review
reviewsRouter.post('/', requireLogin, async (req, res, next) => {
  try {
    const user = req.user;
    const { itemId, stars, description } = req.body;
    const userReview = await createReview({
      username: user.username,
      userId: user.id,
      itemId,
      stars,
      description
    });

    res.send(userReview)
  } catch (error) {
    throw error
  }
})

//Patch my Review 
reviewsRouter.patch('/:reviewId', requireLogin, async (req, res, next) => {
  const { reviewId } = req.params;
  const { ...fields } = req.body;

  try {
    const originalReview = await getReviewById(reviewId);
    if (canEditReview(req.user.id, originalReview.id)) {
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

module.exports = reviewsRouter;