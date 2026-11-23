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
    name: "Alice",
    email: "alice@example.com",
    address: {
      city: "Paris",
      country: "France"
    }
  });

  // TODO 2: insert a user with a skills array containing at least 3 items.
  await users.insertOne({
    name: "Bob",
    email: "bob@example.com",
    skills: ["Node.js", "MongoDB", "Docker"]
  });

  // TODO 3: use insertMany to insert at least 5 users in a single call.
  // Requirements:
  //   - At least 2 users must have address.country set to "France"
  //   - At least 2 users must have a skills array with at least 1 item
  await users.insertMany([
    {
      name: "Eve",
      email: "eve@example.com",
      address: { city: "Luxembourg City", country: "Luxembourg" },
      skills: ["Go", "Kubernetes"],
      avatar: "https://images.pexels.com/photos/8278980/pexels-photo-8278980.jpeg"
    },
    {
      name: "Frank",
      email: "frank@example.com",
      skills: ["TypeScript", "React", "Next.js"],
      avatar: "https://images.pexels.com/photos/5439136/pexels-photo-5439136.jpeg"
    },
    {
      name: "Grace",
      email: "grace@example.com",
      address: { city: "Madrid", country: "Spain" },
      skills: ["Musician", "Composer"],
      avatar: "https://images.pexels.com/photos/12333568/pexels-photo-12333568.jpeg"
    },
    {
      name: "Camille",
      email: "camille@example.com",
      address: { city: "Lyon", country: "France" },
      skills: ["Python", "Data Science"]
    },
    {
      name: "Lucas",
      email: "lucas@example.com",
      address: { city: "Marseille", country: "France" }
    }
  ]);

  // TODO 4: retrieve all documents and log each user's name.
  console.log("--- All users ---");
  const allUsers = await users.find({}).toArray();
  allUsers.forEach((user) => console.log(user.name));

  // TODO 5: use dot notation to find the user whose address.city is "Paris" and log the result.
  console.log("\n--- User in Paris ---");
  const parisUser = await users.findOne({ "address.city": "Paris" });
  console.log(parisUser);

  // TODO 6: find all users whose address.country is "France" and log their names.
  console.log("\n--- Users in France ---");
  const frenchUsers = await users.find({ "address.country": "France" }).toArray();
  frenchUsers.forEach((user) => console.log(user.name));

  // TODO 7: find all users who have a skills field and log their names.
  console.log("\n--- Users with skills ---");
  const skilledUsers = await users.find({ skills: { $exists: true } }).toArray();
  skilledUsers.forEach((user) => console.log(user.name));

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});