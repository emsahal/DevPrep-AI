<!--LANG:roman-->

<!--LANG:roman-->

# MongoDB Interview Questions

## 1. What is MongoDB and how does it differ from relational databases?

**Asaan Urdu mein:**  
MongoDB ek **NoSQL document database** hai jo data ko JSON‑jaisa BSON documents mein store karta hai. Relational databases tables aur rows use karte hain aur schema fixed hota hai, jabke MongoDB mein har document ka apna dynamic schema ho sakta hai. Collections documents ka group hoti hain, foreign keys ki zaroorat nahi hoti. MongoDB horizontal scaling (sharding) aur high write throughput ke liye optimized hai.

---

## 2. What is a document and a collection in MongoDB?

**Asaan Urdu mein:**  
Document ek single record hota hai jo **BSON** key‑value pairs se bana hota hai, aur har document ka mandatory `_id` field hota hai. Collection documents ka logical group hoti hai, jo relational database ki table ke barabar hoti hai lekin bina fixed schema ke. Documents ko insert, query, update ya delete kiya ja sakta hai.

---

## 3. What is the difference between SQL joins and MongoDB's $lookup?

**Asaan Urdu mein:**  
SQL joins do tables ko foreign key ke basis par combine karte hain, jabke `$lookup` ek aggregation stage hai jo **left outer join** do collections ke beech karta hai. SQL joins relational algebra ka hissa hain, jabke `$lookup` pipeline ka ek step hai. MongoDB mein data ko embed karna preferred hota hai taake joins ki zaroorat kam ho.

---

## 4. What is schema design in MongoDB, and what is denormalization used for?

**Asaan Urdu mein:**  
Schema design decide karta hai ke data ko **embed** karna hai ya **reference** use karna hai, based on query patterns. Denormalization ka matlab related data ko ek hi document mein store karna hota hai, jisse read performance improve hoti hai lekin data duplication aur complex updates ka risk badhta hai. Design hamesha application ke access aur update patterns ko match karna chahiye.

---

## 5. What is the difference between embedding and referencing documents?

**Asaan Urdu mein:**  
Embedding ka matlab related data ko parent document ke andar store karna hota hai, jo one‑to‑few relationships ke liye fast reads provide karta hai. Referencing mein ek document doosre document ka **ObjectId** store karta hai, jo unbounded ya frequently updated data ke liye behtar hota hai. Embed “contains” relationship dikhata hai, reference “belongs‑to” relationship.

---

## 6. What are indexes in MongoDB and why are they important?

**Asaan Urdu mein:**  
Indexes ek special data structure hain jo queries ko **fast** banate hain; bina index ke MongoDB har document scan karta hai (COLLSCAN). Indexes read performance ko dramatically improve karte hain, lekin storage aur write speed par impact dalte hain. MongoDB automatically `_id` ke liye index banata hai aur single‑field, compound, multikey, text, geospatial, hashed jaise types support karta hai.

---

## 7. What is the aggregation pipeline in MongoDB?

**Asaan Urdu mein:**  
Aggregation pipeline documents ko ek series of stages se guzarata hai, jaise `$match` (filter), `$group` (group), `$sort`, `$project`, `$lookup`, `$unwind` etc. Ye powerful tool analytics, reporting aur complex data transformations ke liye use hota hai. Har stage ek new document set produce karti hai jo agle stage ko feed hoti hai.

---

## 8. What is the difference between find() and aggregate()?

**Asaan Urdu mein:**  
`find()` simple queries ke liye hota hai – filtering, projection, sorting, pagination. `aggregate()` multi‑stage pipeline provide karta hai jo grouping, calculations, joins aur reshaping jaise advanced operations perform karta hai. `find()` cursor return karta hai jo original documents ko stream karta hai, jabke `aggregate()` computed result set return karta hai.

---

## 9. What is a replica set in MongoDB?

**Asaan Urdu mein:**  
Replica set ek group of MongoDB servers hota hai jo identical data maintain karte hain high availability ke liye. Ek **primary** node writes accept karta hai, baaki **secondary** nodes data replicate karte hain. Primary fail hone par election hoti hai aur koi secondary automatically primary ban jata hai. Reads ko secondaries par bhi route karke read scaling achieve ki ja sakti hai.

---

## 10. What is sharding in MongoDB and when is it needed?

**Asaan Urdu mein:**  
Sharding data ko multiple servers (shards) par horizontally distribute karta hai, shard key ke basis par. Jab data size ya write throughput single server ki capacity se exceed ho jaye, ya working set RAM mein fit na ho, tab sharding zaroori hoti hai. Sharding ke liye config servers aur `mongos` routers ki zaroorat hoti hai; vertical scaling ke baad hi use karna chahiye.

---

## 11. What is the difference between MongoDB's ACID transactions support before and after v4.0?

**Asaan Urdu mein:**  
v4.0 se pehle ACID sirf single‑document operations tak limited tha. v4.0 ke baad **multi‑document ACID transactions** replica sets mein introduce hue, aur v4.2 se sharded clusters mein bhi support mila. Ab transactions atomicity, consistency, isolation, durability ko multiple documents aur collections tak guarantee karte hain.

---

## 12. What is the ObjectId and how is it generated?

**Asaan Urdu mein:**  
ObjectId 12‑byte BSON primary key hota hai: 4 bytes timestamp, 5 bytes random (machine + process), aur 3 bytes counter. Ye client side generate hota hai, isliye network round‑trip ki zaroorat nahi. ObjectId monotonically increase hota hai aur creation time ko encode karta hai, jo debugging aur sorting mein useful hota hai.

---

## 13. How does MongoDB handle schema validation?

**Asaan Urdu mein:**  
MongoDB **JSON Schema** validation support karta hai (v3.2+), jisme required fields, data types, patterns, ranges aur nested structures define kiye ja sakte hain. Validation actions `error` (reject) ya `warn` (log) ho sakte hain. Validation rules collection creation ke waqt ya `collMod` command se modify ki ja sakti hain.

---

## 14. What is the difference between $set, $push, and $unset update operators?

**Asaan Urdu mein:**  
`$set` existing field ko replace ya naya field create karta hai. `$push` array ke end mein element add karta hai (optional `$each`, `$sort`, `$slice`). `$unset` field ko document se completely remove karta hai. Ye operators `updateOne`, `updateMany` ya `findAndModify` ke saath use hote hain.

---

## 15. What is the purpose of the explain() method in MongoDB?

**Asaan Urdu mein:**  
`explain()` query ka execution plan return karta hai, jisme index usage (IXSCAN vs COLLSCAN), scanned documents, returned documents aur execution time dikhaya jata hai. `executionStats` mode detailed metrics provide karta hai. Agar `totalDocsExamined` `nReturned` se bahut zyada ho, to better index create karna chahiye.

---

## 16. What is the difference between a compound index and a single-field index?

**Asaan Urdu mein:**  
Single‑field index sirf ek field ko index karta hai. Compound index multiple fields ko ek hi index structure mein store karta hai aur **prefix** queries ko support karta hai. Index field order important hoti hai – equality fields first, then sort fields, then range fields (ESR rule). Compound index se multi‑field sorting aur filtering efficient hoti hai.

---

## 17. How does Mongoose help when working with MongoDB in Node.js?

**Asaan Urdu mein:**  
Mongoose ek **ODM (Object Data Modeling)** library hai jo schema‑based modeling, validation, type casting, query building, middleware (hooks), population (reference resolution) aur virtual properties provide karta hai. Ye native driver ke upar ek abstraction layer add karta hai, jis se code maintainable aur expressive banta hai.

---

## 18. What is the difference between Mongoose schemas and MongoDB's native schema-less nature?

**Asaan Urdu mein:**  
MongoDB khud **schema‑less** hai – collection ke documents alag‑alag fields rakh sakte hain. Mongoose application layer par **schema** enforce karta hai, types, validation aur defaults define karta hai, isse data consistency improve hoti hai. Flexibility kam hoti hai, lekin development safety milti hai. Native driver se direct schema‑less operations bhi possible hain.

---

## 19. What is a capped collection in MongoDB?

**Asaan Urdu mein:**  
Capped collection fixed size ki hoti hai; jab size fill ho jata hai to oldest documents automatically overwrite ho jate hain. Documents insertion order mein store hote hain aur delete/update limited hoti hai. Ye logs, caches aur real‑time streams ke liye ideal hai, aur **tailable cursor** support karti hai (like `tail -f`).

---

## 20. How do you handle relationships (one-to-many, many-to-many) in a NoSQL database like MongoDB?

**Asaan Urdu mein:**  
One‑to‑many relationships ke liye **embedding** (few items) ya **array of references** (many items) use ki jati hain. Many‑to‑many ke liye dono sides par reference arrays ya ek separate junction collection banaya jata hai. References ko resolve karne ke liye `$lookup` aggregation ya Mongoose `populate()` use hota hai.

---

## 21. What is the write concern and read concern in MongoDB?

**Asaan Urdu mein:**  
Write concern define karta hai ki write operation ke liye kitni acknowledgments chahiye: `w:0` (fire‑and‑forget), `w:1` (primary), `w:"majority"` (majority of replicas). Read concern data consistency define karta hai: `local` (latest, may roll back), `majority` (committed), `snapshot` (transaction snapshot). Higher levels durability improve karte hain lekin latency badh sakti hai.

---

## 22. What is the difference between upsert and a regular update?

**Asaan Urdu mein:**  
Regular update sirf existing documents ko modify karta hai. **Upsert** (`upsert:true`) agar matching document na mile to naya document insert karta hai, otherwise update karta hai. Upserts idempotent operations jaise counters ya unique records ensure karne ke liye useful hote hain.

---

## 23. How would you optimize a slow MongoDB query?

**Asaan Urdu mein:**  
1. `explain()` se current execution plan dekho – COLLSCAN vs IXSCAN.  
2. Appropriate **indexes** create karo (ESR rule: Equality → Sort → Range).  
3. Projection limit karo – sirf required fields fetch karo.  
4. Aggregation pipelines mein `$match` ko early stage pe rakho.  
5. Regex ya $where ko avoid karo, aur covered queries prefer karo.  
6. Large collections ke liye sharding consider karo.

---

## 24. What is the difference between MongoDB Atlas and a self-hosted MongoDB instance?

**Asaan Urdu mein:**  
| Feature | MongoDB Atlas | Self‑hosted |
|---------|---------------|------------|
| **Management** | Fully managed (backups, scaling, monitoring, patches) | Manual installation, configuration, maintenance |
| **Availability** | Multi‑region, 99.995% SLA, automated failover | Depends on your setup |
| **Backups** | Automated PITR, snapshots | Custom scripts needed |
| **Cost** | Higher operational cost, pay‑as‑you‑go | Lower raw hardware cost, but ops overhead |
| **Control** | Limited OS/DB config control | Full control over hardware, OS, DB settings |

Atlas aapko UI, auto‑scaling aur built‑in monitoring deta hai, jabke self‑hosted aapko poora control aur lower raw cost provide karta hai, lekin operational expertise ki zaroorat hoti hai.

<!--LANG:english-->

# MongoDB Interview Questions

## 1. What is MongoDB and how does it differ from relational databases?

MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents with dynamic schemas. Unlike relational databases (SQL) that use tables, rows, and fixed schemas with foreign key relationships, MongoDB uses collections and documents, allowing embedded/nested data structures. MongoDB scales horizontally through sharding and is optimized for high write throughput and rapid iteration on data models.

```javascript
const userDocument = {
  _id: ObjectId(),
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '+1234567890',
  address: { street: '123 Main St', city: 'New York' },
  tags: ['premium', 'vip'],
  createdAt: new Date()
};
db.users.insertMany([
  { name: 'Bob', email: 'bob@test.com' },
  { name: 'Carol', email: 'carol@test.com', age: 30, preferences: { theme: 'dark' } }
]);
```

---

## 2. What is a document and a collection in MongoDB?

A document is a record stored as a BSON object with key-value pairs. A collection is a group of documents, analogous to a SQL table but without a fixed schema. The `_id` field is mandatory as the primary key.

```javascript
db.products.insertOne({ _id: ObjectId(), name: 'Laptop', price: 999.99, specs: { cpu: 'i7' } });
db.products.insertOne({ name: 'Mouse', price: 29.99, color: 'black', wireless: true });
db.products.find({ price: { $lt: 100 } });
db.products.find({ 'specs.ram': '16GB' });
```

---

## 3. What is the difference between SQL joins and MongoDB's $lookup?

SQL joins combine rows from two tables based on a foreign key. MongoDB's `$lookup` aggregation stage performs a left outer join between two collections. Unlike SQL joins which are part of relational algebra, `$lookup` is one stage in the aggregation pipeline. MongoDB prefers embedding related data to avoid joins for better performance.

```javascript
db.orders.insertMany([
  { _id: 1, product: 'Laptop', userId: 101, quantity: 1 },
  { _id: 2, product: 'Mouse', userId: 102, quantity: 2 }
]);
db.users.insertMany([
  { _id: 101, name: 'Alice' }, { _id: 102, name: 'Bob' }
]);
db.orders.aggregate([
  { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
  { $unwind: '$user' },
  { $project: { product: 1, quantity: 1, 'user.name': 1 } }
]);
```

---

## 4. What is schema design in MongoDB, and what is denormalization used for?

Schema design determines what to embed vs reference based on access patterns. Denormalization stores related data together in a single document (embedding), reducing joins for better read performance at the cost of data duplication and more complex updates. The design priority matches how the app queries and updates data.

```javascript
// Normalized
db.authors.insertOne({ _id: 1, name: 'Jane Austen', bio: 'English novelist' });
db.books.insertOne({ _id: 101, title: 'Pride and Prejudice', authorId: 1, published: 1813 });
db.books.aggregate([
  { $lookup: { from: 'authors', localField: 'authorId', foreignField: '_id', as: 'author' } }
]);
// Denormalized
db.books.insertOne({
  _id: 201, title: 'Sense and Sensibility', published: 1811,
  author: { name: 'Jane Austen', bio: 'English novelist' },
  reviews: [ { user: 'Alice', rating: 5, comment: 'Classic!' } ]
});
```

---

## 5. What is the difference between embedding and referencing documents?

Embedding stores related data inside the parent document for one-to-few relationships, optimizing reads. Referencing stores a pointer to related documents in separate collections, better for unbounded growth or frequently updated data shared across many parents. Embed for "contains", reference for "belongs-to".

```javascript
// Embedding
db.customers.insertOne({
  _id: 1, name: 'Alice',
  addresses: [
    { type: 'home', street: '123 Main St', city: 'NYC' },
    { type: 'work', street: '456 Market St', city: 'SF' }
  ]
});
// Referencing
db.products.insertOne({ _id: 1, name: 'Laptop', price: 999 });
db.reviews.insertMany([
  { productId: 1, userId: 101, rating: 5, text: 'Great!' },
  { productId: 1, userId: 102, rating: 4, text: 'Good' }
]);
db.reviews.find({ productId: 1 }).sort({ createdAt: -1 }).limit(20);
```

---

## 6. What are indexes in MongoDB and why are they important?

Indexes are data structures for efficient query execution � without them MongoDB scans every document (COLLSCAN). Indexes dramatically improve performance at the cost of extra storage and slower writes. MongoDB auto-indexes `_id` and supports single-field, compound, multikey, text, geospatial, and hashed indexes.

```javascript
for (let i = 0; i < 100000; i++) {
  db.users.insertOne({ name: 'User ' + i, email: 'user' + i + '@example.com', age: Math.floor(Math.random() * 80) + 18, status: i % 2 === 0 ? 'active' : 'inactive' });
}
db.users.find({ email: 'user50000@example.com' }).explain('executionStats');
db.users.createIndex({ email: 1 });
db.users.find({ email: 'user50000@example.com' }).explain('executionStats');
db.users.createIndex({ status: 1, age: -1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

---

## 7. What is the aggregation pipeline in MongoDB?

The aggregation pipeline processes documents through stages: `$match` (filter), `$group` (grouping), `$sort`, `$project` (reshape), `$lookup` (join), `$unwind`, `$bucket`, `$facet`, and more. It is powerful for analytics, reporting, and complex data transformations.

```javascript
db.orders.insertMany([
  { _id: 1, customer: 'Alice', items: ['Laptop', 'Mouse'], total: 1029.98, status: 'delivered', date: ISODate('2024-01-15') },
  { _id: 2, customer: 'Bob', items: ['Keyboard'], total: 79.99, status: 'pending', date: ISODate('2024-01-20') },
  { _id: 3, customer: 'Alice', items: ['Monitor'], total: 299.99, status: 'shipped', date: ISODate('2024-02-01') }
]);
db.orders.aggregate([
  { $match: { status: { $in: ['delivered', 'shipped'] } } },
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 }, avgOrderValue: { $avg: '$total' } } },
  { $sort: { totalSpent: -1 } },
  { $project: { _id: 0, customer: '$_id', totalSpent: { $round: ['$totalSpent', 2] }, orderCount: 1, avgOrderValue: { $round: ['$avgOrderValue', 2] } } },
  { $limit: 10 }
]);
```

---

## 8. What is the difference between find() and aggregate()?

`find()` is for simple queries � filtering, projection, sorting, and pagination. `aggregate()` is a pipeline for multi-stage transformations including grouping, calculations, joins, and reshaping. `find()` returns a cursor to documents; `aggregate()` returns the computed result. For anything beyond basic CRUD, use `aggregate()`.

```javascript
db.users.find({ status: 'active' });
db.users.find({ status: 'active', age: { $gte: 21 } }, { name: 1, email: 1, _id: 0 });
db.users.find({ status: 'active' }).sort({ name: 1 }).skip(20).limit(10);
db.users.countDocuments({ status: 'active' });
db.users.aggregate([
  { $match: { status: 'active' } },
  { $bucket: { groupBy: '$age', boundaries: [18, 25, 35, 50, 65, 100], default: 'Other', output: { count: { $sum: 1 }, users: { $push: '$name' } } } },
  { $sort: { count: -1 } }
]);
```

---

## 9. What is a replica set in MongoDB?

A replica set provides high availability by maintaining identical data across multiple servers. One primary accepts writes; secondary nodes replicate data. If the primary fails, an election promotes a secondary automatically. Replica sets also enable read scaling by directing queries to secondaries.

```javascript
const { MongoClient } = require('mongodb');
async function connectReplicaSet() {
  const client = new MongoClient('mongodb://localhost:27017,localhost:27018,localhost:27019/mydb?replicaSet=rs0', { readPreference: 'primaryPreferred' });
  await client.connect();
  const db = client.db('mydb');
  await db.collection('users').insertOne({ name: 'Alice' });
  await db.collection('users').withReadPreference('secondary').find({}).toArray();
  await db.collection('orders').insertOne({ item: 'Laptop', qty: 1 }, { writeConcern: { w: 'majority', wtimeout: 5000 } });
}
```

---

## 10. What is sharding in MongoDB and when is it needed?

Sharding distributes data across multiple servers horizontally using a shard key. It's needed when data exceeds a single server's capacity, write throughput exceeds single-node limits, or RAM cannot hold the working set. Sharding adds config servers and mongos routers � use only when vertical scaling is no longer viable.

```javascript
sh.enableSharding('myApp');
db.users.createIndex({ userId: 'hashed' });
sh.shardCollection('myApp.users', { userId: 'hashed' });
const { MongoClient } = require('mongodb');
async function shardedQuery() {
  const client = new MongoClient('mongodb://mongos1:27017,mongos2:27017/myApp');
  await client.connect();
  const db = client.db('myApp');
  await db.collection('users').find({ userId: 12345 }).toArray();
  await db.collection('users').find({ name: 'Alice' }).toArray();
}
```

---

## 11. What is the difference between MongoDB's ACID transactions support before and after v4.0?

Before MongoDB 4.0, ACID was limited to single-document operations. v4.0+ added multi-document ACID transactions for replica sets; v4.2+ extended to sharded clusters. Transactions now support atomicity, consistency, isolation, and durability across multiple documents and collections.

```javascript
const { MongoClient } = require('mongodb');
async function transferFunds(fromId, toId, amount) {
  const client = new MongoClient('mongodb://localhost:27017/banking');
  await client.connect();
  const db = client.db('banking');
  const session = client.startSession();
  try {
    session.startTransaction({ readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
    const accounts = db.collection('accounts');
    await accounts.updateOne({ _id: fromId }, { $inc: { balance: -amount } }, { session });
    await accounts.updateOne({ _id: toId }, { $inc: { balance: amount } }, { session });
    await session.commitTransaction();
    console.log('Transfer atomic across documents');
  } catch (err) {
    await session.abortTransaction();
    console.log('Rolled back');
  } finally {
    session.endSession();
    await client.close();
  }
}
```

---

## 12. What is the ObjectId and how is it generated?

ObjectId is a 12-byte BSON primary key: 4 bytes timestamp, 5 bytes random (machine + process), 3 bytes counter. It requires no database communication to generate, making it safe for distributed systems. It is monotonically increasing and encodes creation time.

```javascript
const id = ObjectId();
print(id.getTimestamp());
db.orders.aggregate([
  { $addFields: { createdAt: { $toDate: '$_id' } } },
  { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }
]);
db.products.insertOne({ _id: 'SKU-001', name: 'Custom ID' });
```

---

## 13. How does MongoDB handle schema validation?

MongoDB supports JSON Schema validation (v3.2+) with required fields, types, value ranges, and nested structures. Validation actions include `error` (reject invalid) or `warn` (log but allow). Rules are set at collection creation or via `collMod`.

```javascript
db.createCollection('employees', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'department'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
        age: { bsonType: 'int', minimum: 18, maximum: 120 },
        department: { enum: ['Engineering', 'Sales', 'HR'] }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});
db.employees.insertOne({ name: 'Alice', email: 'alice@company.com', age: 30, department: 'Engineering' });
db.employees.insertOne({ name: 'Bob', email: 'invalid', department: 'Unknown' });
```

---

## 14. What is the difference between $set, $push, and $unset update operators?

`$set` replaces/creates a field value. `$push` appends an element to an array. `$unset` removes a field from a document. These are field update operators for `updateOne`, `updateMany`, and `findAndModify`.

```javascript
db.users.insertOne({ _id: 1, name: 'Alice', age: 30, hobbies: ['reading', 'swimming'], address: { city: 'NYC' } });
db.users.updateOne({ _id: 1 }, { $set: { age: 31, 'address.city': 'Brooklyn', phone: '+1234567890' } });
db.users.updateOne({ _id: 1 }, { $push: { hobbies: 'yoga' } });
db.users.updateOne({ _id: 1 }, { $push: { hobbies: { $each: ['cooking', 'hiking'], $sort: 1, $slice: 5 } } });
db.users.updateOne({ _id: 1 }, { $unset: { phone: '' } });
db.users.updateOne({ _id: 1 }, { $inc: { loginCount: 1 } });
db.users.updateOne({ _id: 1 }, { $pull: { hobbies: 'cooking' } });
db.users.updateOne({ _id: 1 }, { $addToSet: { hobbies: 'yoga' } });
```

---

## 15. What is the purpose of the explain() method in MongoDB?

`explain()` returns the query execution plan showing index usage (IXSCAN vs COLLSCAN), documents examined vs returned, and execution time. Use `executionStats` mode for detailed optimization metrics. If `totalDocsExamined` greatly exceeds `nReturned`, a better index is needed.

```javascript
db.users.find({ email: 'user50000@example.com' }).explain('executionStats');
// Look for: stage, totalDocsExamined, nReturned, executionTimeMillis
db.users.find({ status: 'active', age: { $gte: 25 } }).sort({ name: 1 }).explain('allPlansExecution');
db.users.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$age', count: { $sum: 1 } } }
]).explain('executionStats');
```

---

## 16. What is the difference between a compound index and a single-field index?

A single-field index indexes one column. A compound index indexes multiple fields in one structure and supports queries on any prefix of its fields. The order matters � equality fields first, then sort, then range (ESR rule). Compound indexes can also support sorting on multiple fields.

```javascript
db.users.createIndex({ email: 1 });
db.users.createIndex({ status: 1, age: -1 });
// Supports: { status: 'active' }, { status: 'active', age: 30 }
// Does NOT support: { age: 30 } alone
db.users.createIndex({ city: 1, status: 1, name: 1, age: -1 });
// ESR: Equality (city, status), Sort (name), Range (age)
// Optimized for: find({ city: 'NYC', status: 'active', age: { $gte: 25 } }).sort({ name: 1 })
```

---

## 17. How does Mongoose help when working with MongoDB in Node.js?

Mongoose is an ODM providing schema-based modeling with validation, type casting, query building, middleware (hooks), population (reference resolution), and virtual properties. It adds structure on top of the native MongoDB driver, making code more maintainable.

```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myapp');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, min: 18, max: 120 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  hobbies: [String]
}, { timestamps: true });

userSchema.methods.greet = function() { return 'Hello, ' + this.name; };
userSchema.statics.findByRole = function(role) { return this.find({ role }); };
userSchema.pre('save', function(next) { this.email = this.email.toLowerCase(); next(); });

const User = mongoose.model('User', userSchema);
const user = await User.create({ name: 'Alice', email: 'Alice@Example.com', age: 30 });
const activeUsers = await User.find({ role: 'user' }).where('age').gte(21).sort({ name: 1 }).limit(10);
```

---

## 18. What is the difference between Mongoose schemas and MongoDB's native schema-less nature?

MongoDB is schema-less � documents in a collection can have different fields. Mongoose adds an application-layer schema enforcing structure, types, validation, and defaults before data reaches MongoDB. This provides safety at the cost of flexibility. Mongoose is optional � you can access the native driver via `Model.collection` for schema-less operations.

```javascript
db.products.insertOne({ name: 'Laptop', price: 999 });
db.products.insertOne({ title: 'Mouse', cost: 29.99, color: 'black' });
const productSchema = new mongoose.Schema({ name: String, price: Number });
const Product = mongoose.model('Product', productSchema);
await Product.create({ name: 'Laptop', price: 999 });
await Product.collection.insertOne({ title: 'Mouse', cost: 29.99 });
```

---

## 19. What is a capped collection in MongoDB?

A capped collection is a fixed-size collection that auto-overwrites oldest documents when full. Documents store in insertion order and cannot be deleted or updated (if size increases). Ideal for logs, caches, and real-time data. Supports tailable cursors (like `tail -f`).

```javascript
db.createCollection('logs', { capped: true, size: 1048576, max: 1000 });
for (let i = 1; i <= 1500; i++) {
  db.logs.insertOne({ message: 'Log ' + i, level: 'info', timestamp: new Date() });
}
db.logs.countDocuments();  // 1000
db.logs.find().sort({ $natural: -1 }).limit(1);
const cursor = db.logs.find().addCursorFlag('tailable', true).addCursorFlag('awaitData', true);
```

---

## 20. How do you handle relationships (one-to-many, many-to-many) in a NoSQL database like MongoDB?

One-to-many uses embedding for few items or referencing with ObjectId arrays for many. Many-to-many uses arrays of references on both sides or a junction collection. Use `$lookup` or Mongoose `populate()` for reference resolution.

```javascript
db.users.insertOne({ _id: 1, name: 'Alice', creditCards: [ { type: 'Visa', last4: '1234' }, { type: 'MC', last4: '5678' } ] });
db.orders.insertMany([ { _id: 101, userId: 1, total: 100 }, { _id: 102, userId: 1, total: 50 } ]);
db.students.insertOne({ _id: 1, name: 'Alice', courseIds: [101, 102] });
db.courses.insertMany([ { _id: 101, title: 'Math', studentIds: [1, 2] }, { _id: 102, title: 'Physics', studentIds: [1, 3] } ]);
db.students.aggregate([
  { $match: { _id: 1 } },
  { $lookup: { from: 'courses', localField: 'courseIds', foreignField: '_id', as: 'courses' } }
]);
```

---

## 21. What is the write concern and read concern in MongoDB?

Write concern controls acknowledgment level for writes: `w: 0` (fire-and-forget), `w: 1` (primary), `w: 'majority'` (replica set majority). Read concern controls consistency: `local` (latest data, may roll back), `majority` (committed data), `snapshot` (transaction snapshot). Both affect performance/durability tradeoffs.

```javascript
db.users.insertOne({ name: 'Alice' }, { writeConcern: { w: 0 } });
db.users.insertOne({ name: 'Bob' });
db.users.insertOne({ name: 'Carol' }, { writeConcern: { w: 'majority', j: true, wtimeout: 5000 } });
db.users.find({}).readConcern('local');
db.users.find({}).readConcern('majority');
db.users.find({}).readConcern('snapshot');
const session = client.startSession();
session.startTransaction({ readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
```

---

## 22. What is the difference between upsert and a regular update?

A regular update modifies existing documents matching the filter. An upsert (`upsert: true`) inserts a new document if no match exists, or updates if one does. Upserts are useful for idempotent operations like counters or ensuring unique records.

```javascript
db.visits.updateOne({ page: '/home' }, { $inc: { count: 1 } });
db.visits.updateOne({ page: '/home' }, { $inc: { count: 1 } }, { upsert: true });
db.users.updateOne(
  { email: 'alice@example.com' },
  { $set: { lastLogin: new Date() }, $setOnInsert: { name: 'Alice', email: 'alice@example.com', createdAt: new Date(), role: 'user' } },
  { upsert: true }
);
const pages = ['/home', '/about', '/contact'];
const ops = pages.map(p => ({ updateOne: { filter: { page: p }, update: { $inc: { count: 1 } }, upsert: true } }));
db.visits.bulkWrite(ops);
```

---

## 23. How would you optimize a slow MongoDB query?

Use `explain()` to check for COLLSCAN vs IXSCAN, create optimal indexes (ESR rule: Equality, Sort, Range), limit projections, use `$match` early in pipelines, avoid regex on indexed fields, and use covered queries. Shard large collections if needed.

```javascript
db.orders.find({ status: 'delivered', total: { $gte: 100 }, createdAt: { $gte: ISODate('2024-01-01') } }).sort({ createdAt: -1 }).explain('executionStats');
db.orders.createIndex({ status: 1, createdAt: -1, total: 1 });
db.orders.find({ status: 'delivered' }, { total: 1, createdAt: 1, _id: 0 });
db.orders.aggregate([
  { $match: { status: 'delivered' } },
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
db.orders.aggregate([{ $indexStats: {} }]);
```

---

## 24. What is the difference between MongoDB Atlas and a self-hosted MongoDB instance?

Atlas is a fully-managed cloud service handling backups, scaling, monitoring, and patching automatically. Self-hosted requires manual installation, configuration, and infrastructure management. Atlas provides a UI, automated backups with PITR, built-in monitoring, and multi-region deployments at a premium cost. Self-hosting gives full control at lower raw cost but requires operational expertise.

```javascript
const { MongoClient } = require('mongodb');
// Atlas (managed)
async function connectAtlas() {
  const client = new MongoClient('mongodb+srv://user:pass@cluster0.abcde.mongodb.net/myapp?retryWrites=true&w=majority');
  await client.connect();
  const db = client.db('myapp');
  await db.collection('users').insertOne({ name: 'Alice' });
  await client.close();
}
// Self-hosted
async function connectSelf() {
  const client = new MongoClient('mongodb://localhost:27017/myapp');
  await client.connect();
  const db = client.db('myapp');
  await db.collection('users').insertOne({ name: 'Bob' });
  await client.close();
}
// Atlas: auto-scaling, 99.995% SLA, built-in monitoring, PITR backups
// Self: full control, lower raw cost, manual ops, custom backup scripts
```

---
