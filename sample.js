// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1 - insertOne with an embedded object
await books.insertOne({
    title: "The Master and Margarita",
    author: "Mikhail Bulgakov",
    publisher: {
      name: "YMCA-Press",
      country: "France"
    }
  });

  // ----------------------------------------------------------
  // In mongosh you would write:
  //   db.books.insertOne({ title: "...", publisher: { name: "...", country: "..." } })
  //
  // Do the same here. Insert one book that has a publisher field
  // containing an embedded object with at least a name and a country.

  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  await books.insertOne({
    title: "Roadside Picnic",
    author: "Arkady and Boris Strugatsky",
    tags: ["sci-fi", "post-apocalyptic", "soviet-classic"]
  });
  // ----------------------------------------------------------
  // Insert one book that has a tags field containing
  // an array of at least 3 strings.

  // ----------------------------------------------------------
  // TODO 3 - insertMany
  await books.insertMany([
    {
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      publisher: { name: "Actes Sud", country: "France" },
      tags: ["psychology", "philosophy", "classic"]
    },
    {
      title: "War and Peace",
      author: "Leo Tolstoy",
      publisher: { name: "The Russian Messenger", country: "Russia" }
    },
    {
      title: "Eugene Onegin",
      author: "Alexander Pushkin",
      tags: ["poetry", "novel-in-verse", "romance"]
    },
    {
      title: "Doctor Zhivago",
      author: "Boris Pasternak",
      publisher: { name: "Gallimard", country: "France" },
      tags: ["historical", "drama", "nobel-prize"]
    },
    {
      title: "We",
      author: "Yevgeny Zamyatin",
      publisher: { name: "E. P. Dutton", country: "USA" },
      tags: ["dystopia", "sci-fi", "classic"]
    }
  ]);

  // ----------------------------------------------------------
  // Insert at least 5 books in a single call using insertMany.
  // Include a mix: some with a publisher object, some with tags, some with both.

  // ----------------------------------------------------------
  // TODO 4 - find all documents
  console.log("--- All books ---");
  const allBooks = await books.find({}).toArray();
  allBooks.forEach((book) => console.log(book.title));
  // ----------------------------------------------------------
  // Retrieve every document in the collection and log each title.
  // Hint: find() returns a cursor - call .toArray() to get an array.

  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
  // ----------------------------------------------------------
  // Find the first book whose publisher.country is "France".
  // Dot notation lets you filter on a field inside an embedded object:
  //   { "publisher.country": "France" }
  // Log the title of the result.

  // ----------------------------------------------------------
  // TODO 6 - find with a filter
  console.log("\n--- All French-published books ---");
  const frenchBooks = await books.find({ "publisher.country": "France" }).toArray();
  console.log(`Count: ${frenchBooks.length}`);
  frenchBooks.forEach((book) => console.log(book.title));
  // ----------------------------------------------------------
  // Find all books whose publisher.country is "France".
  // Log how many there are and list their titles.

  // ----------------------------------------------------------
  // TODO 7 - find with $exists
  console.log("\n--- Books with tags ---");
  const booksWithTags = await books.find({ tags: { $exists: true } }).toArray();
  booksWithTags.forEach((book) => console.log(`${book.title}: [${book.tags.join(", ")}]`));
  // ----------------------------------------------------------
  // Find all books that have a tags field, regardless of its value.
  //   { tags: { $exists: true } }
  // Log each title and its tags array.

  // Always close the connection when you are done.
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
