const express = require("express");
const mongoose = require("mongoose");
/**
 * NODEJS SERVER
 * PORT CONTROL
 * MongoDB Connection
 * IF PASSWORD contains @ then encode with https://meyerweb.com/eric/tools/dencoder/
 * Database Name roc-ecommerce
 * User Access authSource roc-ecommerce
 */

mongoose
    .connect(
        `mongodb+srv://emedilife-demo:${process.env.DB_PASSWORD_ATLAS}@emedilifecluster.eq0bx.mongodb.net/emedilife-demo?retryWrites=true&w=majority`,
        // `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`,
        // `mongodb://localhost:27017/${process.env.DB_NAME}`,
    )
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((err) => {
        console.error("Oops! Could not connect to mongoDB Cluster0", err);
    });
