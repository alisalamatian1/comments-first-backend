const { EWOULDBLOCK, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const express = require("express");
const { constants } = require("http2");
const app = express();
const path = require("path");
const { v4: uuid } = require('uuid');
const methodOverride = require("method-override")

app.use(methodOverride("_method"))


let tweets = [
    {
        id: uuid(),
        username: "Mo",
        comment: "Lez go boys"
    },
    {
        id: uuid(),
        username: "Erin",
        comment: "Lez go girls"
    },
    {
        id: uuid(),
        username: "Ali",
        comment: "Lez go guys"
    }
]


//Any data that comes in, we parse it
app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

const comments = require('./data.json');

app.listen(4000, () => {
    console.log('Listening on the port 4000')
})

app.get('/', (req, res) => {

    res.render('commentshome.ejs', { comments });
})

app.get("/comments/new", (req, res) => {

    res.render('comments/new.ejs')

})

app.get('/comment', (req, res) => {
    console.log(tweets)
    res.render('comments/comment.ejs', { tweets });
    console.log("here is the tweets object\n", { tweets })
})

app.post('/comments', (req, res) => {
    const { username, comment } = req.body;
    tweets.push({ username, comment, id: uuid() });
    console.log(req.body)
    res.redirect("/comment")
    console.log({ username, comment })
})


app.get('/comment/:id', (req, res) => {
    const id = req.params.id;

    console.log("req.param is: ", req.params)

    console.log("the id of the details link that is in all the comment section is:", id)
    //the find function look for the first thing that satisfies the given criterias


    for (let i = 0; i < tweets.length; i++) {
        console.log("the id of the tweet function is: ", tweets[i].id)
    }

    const pickedComment = tweets.find(function (c) {


        console.log("the id in the find function is: ", c.id)
        return c.id == id.slice(1);
    })

    if (tweets[0].id == id.slice(1)) {
        console.log("yey")
    } else {
        console.log("tweets[0].id is: ", tweets[0].id)
        console.log("id is: ", id)
    }

    console.log("the picked comment is: ", pickedComment);

    res.render('comments/show', { id, pickedComment })

})

app.patch('/comment/:id', (req, res) => {

    const { id } = req.params;
    console.log("id:", id)
    const newCommentText = req.body.comment;
    const foundComment = tweets.find(function (c) {
        return c.id == id;
    })

    console.log("foundCommentText", foundComment)
    console.log("newCommentText", newCommentText)
    foundComment.comment = newCommentText;
    res.redirect("/comment")

})

app.get('/comment/:id/edit', (req, res) => {
    const { id } = req.params;
    const foundCommentToEdit = tweets.find(function (c) {
        return c.id == id.slice(1);
    })
    res.render('comments/edit', { foundCommentToEdit })
})

app.delete('/comment/:id', (req, res) => {
    const { id } = req.params;
    tweets = tweets.filter(c => c.id != id.slice(1))
    res.redirect('/comment')
})