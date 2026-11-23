const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const client = new MongoClient(URI);

// You will understand this boilerplate in session 6.
// For now, your job is to fill in the seven TODOs below.

async function main() {
  await client.connect();
  const users = client.db("blog_db").collection("users");

  await users.deleteMany({});

  // TODO 1: insert a user with an embedded address object.
  // The address must have at least a city and a country field.
  await users.insertOne({
    name: "Анна Иванова",
    email: "anna.ivanova@example.com",
    address: {
      city: "Москва",
      country: "Россия",
    },
  });
  // TODO 2: insert a user with a skills array containing at least 3 items.
  await users.insertOne({
    name: "Борис Кузнецов",
    email: "boris.kuznetsov@example.com",
    skills: ["JavaScript", "MongoDB", "Node.js"],
  });

  // TODO 3: use insertMany to insert at least 5 users in a single call.
  // Requirements:
  //   - At least 2 users must have address.country set to "France"
  //   - At least 2 users must have a skills array with at least 1 item
  await users.insertMany([
    {
      name: "Мария Петрова",
      email: "maria.petrova@example.com",
      address: { city: "Paris", country: "France" },
      skills: ["Python", "SQL"],
    },
    {
      name: "Дмитрий Смирнов",
      email: "dmitry.smirnov@example.com",
      address: { city: "Lyon", country: "France" },
      skills: ["Java"],
    },
    {
      name: "Елена Соколова",
      email: "elena.sokolova@example.com",
      address: { city: "Санкт-Петербург", country: "Россия" },
    },
    {
      name: "Фёдор Попов",
      email: "fedor.popov@example.com",
      address: { city: "Казань", country: "Россия" },
    },
    {
      name: "Галина Волкова",
      email: "galina.volkova@example.com",
    },
  ]);

  // TODO 4: retrieve all documents and log each user's name.
  const allUsers = await users.find({}).toArray();
  allUsers.forEach((u) => console.log(u.name));

  // TODO 5: use dot notation to find the user whose address.city is "Paris" and log the result.
  const parisUser = await users.findOne({ "address.city": "Paris" });
  console.log(parisUser);

  // TODO 6: find all users whose address.country is "France" and log their names.
  const frenchUsers = await users.find({ "address.country": "France" }).toArray();
  frenchUsers.forEach((u) => console.log(u.name));

  // TODO 7: find all users who have a skills field and log their names.
  const skilledUsers = await users.find({ skills: { $exists: true } }).toArray();
  skilledUsers.forEach((u) => console.log(u.name));

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1)
});