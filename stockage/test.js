const mongoose = require('mongoose');

run().catch(error => console.log(error.stack));

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cinema', { useNewUrlParser: true });

  // Clear the database every time. This is for the sake of example only,
  // don't do this in prod :)
  //await mongoose.connection.dropDatabase();

  const filmSchema = new mongoose.Schema({ title: String, producer: String });
  const movies = mongoose.model('films', filmSchema);
  await movies.create({ title : "Avatar", producer : "WTF"});

  //await Customer.create({ name: 'A', age: 30, email: 'a@foo.bar' });
  //await Customer.create({ name: 'B', age: 28, email: 'b@foo.bar' });

  // Find all customers
  const docs = await movies.find({});
  console.log(docs);
}
