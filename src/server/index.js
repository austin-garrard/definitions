const app = require('./app')

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Queer Undefined listening on ${port}`);
});

module.exports = app;