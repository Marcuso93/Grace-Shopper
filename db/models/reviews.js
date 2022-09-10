/* eslint-disable no-useless-catch */
const client = require("../client")

async function createReview({
    username, userId, itemId, stars, description
}) {
    try {
        const { rows: [ reviews ] } = await client.query(`
            INSERT INTO reviews(username, "userId", "itemId", stars, description)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `, [username, userId, itemId, stars, description]);
        return reviews
    }catch(error){
        throw error
    }
}
async function getReviewById(Id){
    try{
        const{ rows: [reviews]} = await client.query(`
        SELECT *
        FROM reviews
        WHERE id = $1
        `,[Id])
        return reviews
    }catch(error){
        throw error
    }
}
async function getReviewByItemId(itemId){
    try{
        const{ rows: [reviews]} = await client.query(`
        SELECT *
        FROM reviews
        WHERE "itemId" = $1
        `,[itemId])
        return reviews
    }catch(error){
        throw error
    }
}
async function getReviewsByUserId(userId){
    try{
        const{ rows: [reviews]} = await client.query(`
        SELECT *
        FROM reviews
        WHERE "userId" = $1 
        `,[userId])
        return reviews
    }catch(error){
        throw error
    }
}
async function removeReview(){
    try{
        const{ rows: [removeReview]} = await client.query(`
        UPDATE reviews
        SET "isPublic" = false
        RETURNING *       
        `,[userId])
        return removeReview;
    }catch(error){
        throw error
    }
}
async function getStarsByItemId(itemId){
    try{
        const{ rows: [reviewStars]} = await client.query(`
        SELECT DISTINCT review.*, stars
        FROM reviews
        WHERE "itemId" = $1
        `,[itemId])
        return reviewStars
    }catch(error){
        throw error
    }
}
async function canEditReview(userId, reviewId){
    try{
        const{ rows: [review]} = await client.query(`
        SELECT*
        FROM reviews
        WHERE VALUES ($1, $2)
        RETURNING *
        `,[userId, reviewId])
        return (review.userId === userId)
    }catch(error){
        throw error
    }
}

async function updateReview({id, ...fields}){
    const {stars, description} = fields
    try{
        const{ rows: [review]} = await client.query(`
            UPDATE reviews
            SET "stars"= $2, "description"= $3
            WHERE id = $1
            RETURNING*
        `,[id, stars, description])
        return review
    }catch(error){
        throw error
    }
}


module.exports = {
    createReview,
    getReviewById,
    getReviewByItemId,
    getReviewsByUserId,
    removeReview,
    getStarsByItemId,
    canEditReview,
    updateReview,
};