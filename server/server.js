const app = require('./api/index');
const PORT = process.env.PORT ?? 8000

app.listen(PORT, ( )=> console.log(`Server running on PORT ${PORT}`))