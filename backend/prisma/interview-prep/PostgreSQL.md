<!--LANG:roman-->

# PostgreSQL Interview Questions

## 1. What is PostgreSQL and how does it differ from other relational databases like MySQL?

**Asaan Urdu mein:** PostgreSQL ek advanced open‑source object‑relational database hai jo SQL standards ko bahut strictly follow karta hai. Yeh ACID compliance, MVCC, aur complex data types (JSONB, arrays, custom types) ko native support karta hai. MySQL ke muqable mein PostgreSQL full ACID, better window functions, CTEs, aur concurrent schema changes provide karta hai.  

---

## 2. What is the difference between a primary key and a foreign key?

**Asaan Urdu mein:** Primary key har row ko uniquely identify karti hai aur hamesha NOT NULL hoti hai. Foreign key doosri table ki primary key ko reference karti hai taake referential integrity barqarar rahe; is se ensure hota hai ke inserted value maujood record se match karti ho.  

---

## 3. What are the different types of joins in SQL (inner, left, right, full)?

**Asaan Urdu mein:** JOINs tables ko horizontally combine karte hain. **INNER JOIN** sirf matching rows return karta hai. **LEFT JOIN** left table ki saari rows aur right table se matching rows (na‑match ke liye NULL) deta hai. **RIGHT JOIN** iska ulta hota hai. **FULL JOIN** dono tables ki saari rows return karta hai, missing side ke liye NULLs.  

---

## 4. What is normalization and what are the different normal forms?

**Asaan Urdu mein:** Normalization data redundancy aur dependency ko kam karta hai by organizing columns into separate tables. 1NF – atomic columns, 2NF – 1NF + no partial dependencies, 3NF – 2NF + no transitive dependencies. Higher forms (BCNF, 4NF, 5NF) exist, lekin aam tor par 3NF kaafi hoti hai.  

---

## 5. What is an index and how does it improve query performance?

**Asaan Urdu mein:** Index ek data structure (usually B‑tree) hota hai jo rows ko scan kiye baghair quickly locate karta hai. SELECT, JOIN, aur WHERE clauses ki performance ko dramatically boost karta hai, lekin INSERT/UPDATE/DELETE ki cost badhata hai aur disk space consume karta hai.  

---

## 6. What is the difference between a clustered and non-clustered index (or PostgreSQL's equivalent)?

**Asaan Urdu mein:** Clustered index rows ko physical order mein store karta hai; PostgreSQL native clustered index nahi rakhta, lekin `CLUSTER` command se ek existing index ke basis par table ko one‑time reorder kiya ja sakta hai. Non‑clustered (B‑tree) indexes separate hote hain aur multiple indexes per table allowed hain.  

---

## 7. What is a transaction and what does ACID stand for?

**Asaan Urdu mein:** Transaction multiple operations ko ek atomic unit mein group karta hai – ya to sab commit hotay hain ya sab rollback. **ACID** ka matlab hai **Atomicity**, **Consistency**, **Isolation**, aur **Durability**.  

---

## 8. What are the different isolation levels in PostgreSQL?

**Asaan Urdu mein:** PostgreSQL chaar isolation levels support karta hai: **Read Uncommitted** (internally Read Committed), **Read Committed** (default), **Repeatable Read** (snapshot at transaction start), aur **Serializable** (true serial execution with predicate locking). Higher level zyada consistency lekin kam concurrency.  

---

## 9. What is the difference between DELETE, TRUNCATE, and DROP?

**Asaan Urdu mein:** **DELETE** rows ko ek‑ek karke remove karta hai, `WHERE` clause allowed, triggers fire, aur rollback possible hota hai. **TRUNCATE** poori table ko fast delete karta hai by deallocating pages, `WHERE` allowed nahi, sequences reset ho sakti hain, aur rollback limited hota hai. **DROP** table ka structure aur data dono hi permanently remove kar deta hai.  

---

## 10. What is a view in SQL and why would you use one?

**Asaan Urdu mein:** View ek saved query hoti hai jo virtual table ki tarah behave karti hai. Complex queries ko simplify karta hai, security layer provide karta hai (sirf specific columns expose hoti hain), aur logical data abstraction allow karta hai. Views data store nahi karti, har access par underlying query run hoti hai.  

---

## 11. What is a materialized view and how does it differ from a regular view?

**Asaan Urdu mein:** Materialized view query result ko disk par physically store karti hai, is se read performance bahut fast ho jati hai. Regular view har bar query ko re‑execute karti hai. Materialized view ko manually ya schedule ke through refresh karna padta hai taake data up‑to‑date rahe.  

---

## 12. What are stored procedures and functions in PostgreSQL?

**Asaan Urdu mein:** **Functions** (`CREATE FUNCTION`) ek value return karte hain aur SQL expressions mein use ho sakte hain. **Procedures** (`CREATE PROCEDURE`) PostgreSQL 11 se introduce hue, aur unmein transaction control (COMMIT/ROLLBACK) allowed hota hai. Dono PL/pgSQL ya doosri languages mein likhe ja sakte hain.  

---

## 13. What is the difference between UNION and UNION ALL?

**Asaan Urdu mein:** **UNION** dono queries ke results ko combine karta hai aur duplicate rows ko remove karta hai (implicit DISTINCT). **UNION ALL** sab rows ko bina deduplication ke combine karta hai, is liye faster hota hai. Use UNION jab duplicates unacceptable ho, aur UNION ALL jab aapko pata ho ke duplicates nahi hain ya unki zaroorat na ho.  

---

## 14. What is a JOIN vs a subquery, and when would you prefer one over the other?

**Asaan Urdu mein:** **JOIN** multiple tables ko horizontally combine karta hai aur optimizer ke through efficiently execute hota hai. **Subquery** ek nested query hoti hai – correlated subqueries har outer row ke liye run hoti hain, non‑correlated sirf ek bar. JOINs zyada readable aur performant hote hain; subqueries useful for existence checks (`EXISTS`), scalar comparisons, ya aggregation pehle karne ke liye.  

---

## 15. What is a CTE (Common Table Expression) and when is it useful?

**Asaan Urdu mein:** CTE (`WITH` clause) ek temporary named result set define karta hai jo query ke andar multiple times reference ho sakta hai. Readability improve hoti hai, recursive queries (tree/graph traversal) possible hoti hain, aur complex logic ko separate steps mein break kiya ja sakta hai bina permanent view banaye.  

---

## 16. What is the EXPLAIN ANALYZE command used for?

**Asaan Urdu mein:** `EXPLAIN ANALYZE` query ka execution plan aur actual runtime statistics dikhata hai – jaise index usage, join strategies, row estimates vs actual rows, aur bottlenecks. Yeh primary tool hai query optimization aur performance tuning ke liye.  

---

## 17. What is connection pooling and why is it important (e.g., pgBouncer)?

**Asaan Urdu mein:** Connection pooling database connections ko reuse karta hai taake har client request ke liye naya process spawn na karna pade. PostgreSQL har connection ke liye separate process banata hai, jo heavy hota hai. pgBouncer ek lightweight middleware hai jo hazaron client connections ko limited actual DB connections ke through multiplex karta hai, is se overhead kam hota hai aur connection exhaustion se bachav hota hai.  

---

## 18. What is the difference between VARCHAR and TEXT in PostgreSQL?

**Asaan Urdu mein:** `VARCHAR(n)` ek length‑limited string type hai; agar data limit se zyada ho to error aata hai. `TEXT` unlimited length ka string type hai. Internally dono ka storage same hota hai, performance identical. `VARCHAR` without length is same as `TEXT`. Use `VARCHAR(n)` jab business rule ke liye length constraint chahiye, warna `TEXT` use karein.  

---

## 19. What are constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) used for?

**Asaan Urdu mein:** Constraints data integrity enforce karte hain. **NOT NULL** null values ko block karta hai. **UNIQUE** duplicate values ko prevent karta hai. **CHECK** custom boolean expression ke through data validate karta hai. **FOREIGN KEY** referential integrity maintain karta hai doosri table ke primary key ke against. Application level validation se zyada reliable hota hai.  

---

## 20. What is a deadlock and how can it be avoided?

**Asaan Urdu mein:** Deadlock tab hota hai jab do ya zyada transactions aapas mein aise locks hold karte hain jo doosre ko release karna hota hai, isliye circular wait create hoti hai. PostgreSQL automatically detect karta hai aur ek transaction ko abort kar deta hai. Deadlocks avoid karne ke liye: sab transactions same order mein tables/rows lock karein, transactions ko chhota rakhein, aur consistent lock levels use karein.  

---

## 21. What is the difference between horizontal and vertical scaling for a PostgreSQL database?

**Asaan Urdu mein:** **Vertical scaling** (scale‑up) ek single server ki CPU, RAM, ya storage ko badhata hai – simple lekin hardware limits aur single point of failure hota hai. **Horizontal scaling** (scale‑out) data ko multiple servers par distribute karta hai replication, partitioning, ya sharding ke through. PostgreSQL read replicas, logical replication, FDW, aur Citus jaise extensions se horizontal scaling achieve ki ja sakti hai.  

---

## 22. What is a trigger in PostgreSQL and when would you use one?

**Asaan Urdu mein:** Trigger ek function hota hai jo automatically `INSERT`, `UPDATE`, `DELETE`, ya `TRUNCATE` events ke pehle/baad execute hota hai. Use cases: audit logging, complex business rule enforcement, derived data maintenance, ya cascading changes. Overuse se debugging mushkil ho sakti hai, is liye sirf jab database‑level enforcement zaroori ho tab hi use karein.  

---

## 23. What is JSONB in PostgreSQL and how does it differ from JSON?

**Asaan Urdu mein:** `JSONB` JSON data ko binary format mein store karta hai, jis se indexing (GIN), fast reads, aur path queries possible hoti hain. `JSON` raw text store karta hai, indexing nahi, parsing slower, lekin whitespace aur key order preserve hota hai. `JSONB` usually query performance ke liye preferred hota hai.  

---

## 24. What is database replication and how does PostgreSQL implement it?

**Asaan Urdu mein:** Replication data ko primary server se ek ya zyada replicas tak copy karta hai. PostgreSQL **streaming replication** (WAL shipping) use karta hai jahan replicas continuously WAL records apply karte hain. **Logical replication** selective tables ke liye hoti hai, aur cascading replication allow karta hai ki replica dusre replica ko feed kare.  

---

## 25. What is the N+1 query problem and how would you solve it?

**Asaan Urdu mein:** N+1 problem tab hota hai jab aap N records fetch karte hain aur phir har record ke liye ek extra query chalate hain related data ke liye, total N+1 queries ho jati hain. Solution: **JOINs**, eager loading, ya batch loading use karein taake related data ek hi query mein mil jaye. ORMs mein `include` ya `relations` options se eager loading achieve hoti hai.  

---

## 26. How does PostgreSQL handle full-text search?

**Asaan Urdu mein:** PostgreSQL full‑text search ke liye `tsvector` (tokenized document) aur `tsquery` (search query) types use karta hai. Stemming, stop‑words, aur ranking (`ts_rank`) built‑in hain. `@@` operator matching ke liye, aur GIN indexes fast search ke liye. Heavy‑weight use cases ke liye external engines jaise Elasticsearch bhi consider kiye ja sakte hain.  

---

## 27. What is the difference between a primary key and a foreign key?

**Asaan Urdu mein:** Primary key har row ko uniquely identify karti hai aur hamesha NOT NULL hoti hai. Foreign key doosri table ki primary key ko reference karti hai, is se referential integrity enforce hoti hai – inserted value ko referenced table mein maujood hona zaroori hai.  

---

<!--LANG:english-->

# PostgreSQL Interview Questions

## 1. What is PostgreSQL and how does it differ from other relational databases like MySQL?

**PostgreSQL** is an **open‑source object‑relational database** that emphasizes **SQL standard compliance**, extensibility, and support for complex data types (e.g., **JSONB**, arrays, custom types).  

- **Full ACID** compliance out of the box.  
- Uses **MVCC** (Multi‑Version Concurrency Control) for non‑blocking reads.  
- Richer support for **window functions**, **CTEs**, and **concurrent schema changes** (`CREATE INDEX CONCURRENTLY`).  

**MySQL** typically offers fewer advanced features and may require extra configuration for full ACID and MVCC behavior.

---

## 2. What is the difference between a primary key and a foreign key?

| Feature            | **Primary Key**                              | **Foreign Key**                                   |
|--------------------|----------------------------------------------|---------------------------------------------------|
| Purpose            | Uniquely identifies each row in its table.   | Enforces a relationship to another table’s primary key. |
| Uniqueness         | Must be **unique**.                           | May contain duplicate values.                     |
| Nullability        | **NOT NULL** required.                        | Can be **NULL** unless explicitly disallowed.     |
| Constraint Type    | **Entity integrity**.                         | **Referential integrity**.                        |

---

## 3. What are the different types of joins in SQL (inner, left, right, full)?

| Join Type | Returned Rows                                            |
|-----------|----------------------------------------------------------|
| **INNER** | Only rows with matching keys in **both** tables.         |
| **LEFT**  | All rows from the **left** table + matching right rows (NULL if none). |
| **RIGHT** | All rows from the **right** table + matching left rows (NULL if none). |
| **FULL**  | All rows from **both** tables, NULLs where no match exists. |

---

## 4. What is normalization and what are the different normal forms?

- **Goal:** Reduce data redundancy & update anomalies by organizing data into related tables.  
- **1NF:** Atomic (indivisible) column values.  
- **2NF:** 1NF + no **partial** dependencies on a composite primary key.  
- **3NF:** 2NF + no **transitive** dependencies (non‑key columns depend only on the primary key).  
- Higher forms (BCNF, 4NF, 5NF) exist but 3NF is sufficient for most applications.

---

## 5. What is an index and how does it improve query performance?

- An **index** (usually a **B‑tree**) is a separate data structure that maps key values to row locations.  
- **Benefits:**  
  - Turns full‑table scans into **index scans**, drastically reducing I/O.  
  - Speeds up `SELECT`, `JOIN`, and `WHERE` clauses that filter on indexed columns.  
- **Trade‑offs:**  
  - Extra storage space.  
  - Overhead on `INSERT`, `UPDATE`, `DELETE` because the index must be maintained.

---

## 6. What is the difference between a clustered and non-clustered index (or PostgreSQL's equivalent)?

| Aspect                | **Clustered Index** (SQL Server) | **PostgreSQL Equivalent** |
|-----------------------|-----------------------------------|----------------------------|
| Physical Row Order    | Rows stored **in** index order.   | No native clustered index; `CLUSTER` reorders table **once** based on an existing index. |
| Number per Table      | One per table.                    | Multiple **B‑tree** indexes allowed; they are non‑clustered by nature. |
| Maintenance           | Re‑organized automatically on inserts/updates. | `CLUSTER` must be run manually after significant data changes. |

---

## 7. What is a transaction and what does ACID stand for?

A **transaction** groups one or more SQL statements into a single **atomic** unit of work.  

- **Atomicity:** All statements succeed or all are rolled back.  
- **Consistency:** Database moves from one valid state to another.  
- **Isolation:** Concurrent transactions do not interfere with each other.  
- **Durability:** Once committed, changes survive crashes or power loss.

---

## 8. What are the different isolation levels in PostgreSQL?

| Isolation Level      | Behavior                                                                 |
|----------------------|--------------------------------------------------------------------------|
| **Read Uncommitted** (maps to **Read Committed**) | Sees only committed data; dirty reads are not allowed. |
| **Read Committed** (default) | Each query sees a snapshot of data **as of the start of that query**. |
| **Repeatable Read** | All queries in a transaction see the **same snapshot**; prevents non‑repeatable reads. |
| **Serializable**    | Guarantees **true serial execution** using predicate locking; may abort transactions on conflict. |

Higher levels increase consistency but reduce concurrency.

---

## 9. What is the difference between DELETE, TRUNCATE, and DROP?

| Command   | Row Removal | Can Use `WHERE` | Fires Triggers | Transactional (rollback) | Effect on Sequences |
|-----------|-------------|-----------------|----------------|--------------------------|----------------------|
| **DELETE**| Row‑by‑row  | Yes             | Yes            | Yes                      | No change            |
| **TRUNCATE**| Removes **all** rows instantly | No | No (except `ON TRUNCATE` in newer PG) | Yes (but limited) | Optionally `RESTART IDENTITY` |
| **DROP**  | Removes **table definition** and all data | N/A | N/A | N/A | N/A |

---

## 10. What is a view in SQL and why would you use one?

- A **view** is a saved **SELECT** statement that appears as a virtual table.  
- **Advantages:**  
  - Simplifies complex queries for end users.  
  - Provides a **security layer** by exposing only selected columns/rows.  
  - Enables **logical data abstraction** without duplicating data.  
- Views are **non‑materialized**; the underlying query runs each time the view is accessed.

---

## 11. What is a materialized view and how does it differ from a regular view?

- **Materialized view** stores the result set on disk, offering **fast read performance**.  
- **Regular view** recomputes the query on every access.  
- Materialized views require **manual or scheduled refresh** (`REFRESH MATERIALIZED VIEW`) to stay current.  
- Ideal for expensive aggregations, reporting dashboards, or data that changes infrequently.

---

## 12. What are stored procedures and functions in PostgreSQL?

- **Functions** (`CREATE FUNCTION`) return a value and can be used in SQL expressions.  
- **Procedures** (`CREATE PROCEDURE`, PostgreSQL 11+) can contain **transaction control** (`COMMIT`, `ROLLBACK`) and are invoked with `CALL`.  
- Both are typically written in **PL/pgSQL** (or other supported languages) and reduce client‑server round‑trips for complex logic.

---

## 13. What is the difference between UNION and UNION ALL?

| Feature            | **UNION**                              | **UNION ALL**                         |
|--------------------|----------------------------------------|---------------------------------------|
| Duplicate Removal  | Implicit **DISTINCT** – removes duplicates. | Keeps **all** rows, no deduplication. |
| Performance        | Slower (needs sorting/unique step).   | Faster (simple concatenation).        |
| Use Case           | When duplicate rows are **unacceptable**. | When you know data is already unique or duplicates are acceptable. |

---

## 14. What is a JOIN vs a subquery, and when would you prefer one over the other?

- **JOIN** combines rows from multiple tables in a single result set; the optimizer can reorder and parallelize joins efficiently.  
- **Subquery** is a nested query that may be **correlated** (executed per outer row) or **non‑correlated** (executed once).  
- **Prefer JOIN** for most multi‑table queries: clearer, usually faster, and better optimized.  
- **Use subqueries** for:  
  - Existence checks (`EXISTS`).  
  - Scalar comparisons (`WHERE column > (SELECT AVG(...))`).  
  - Situations where you need to aggregate before joining.

---

## 15. What is a CTE (Common Table Expression) and when is it useful?

- Defined with the `WITH` clause, a **CTE** creates a temporary named result set that can be referenced multiple times within the same query.  
- **Benefits:**  
  - Improves **readability** by breaking complex logic into logical steps.  
  - Enables **recursive queries** (e.g., hierarchical data).  
  - Avoids creating permanent views for one‑off analyses.  

---

## 16. What is the EXPLAIN ANALYZE command used for?

- `EXPLAIN` shows the **planned execution strategy** without running the query.  
- `EXPLAIN ANALYZE` **executes** the query and reports **actual timing, row counts, and loop counts**.  
- It reveals whether indexes are used, join methods chosen, and where performance bottlenecks lie—essential for query tuning.

---

## 17. What is connection pooling and why is it important (e.g., pgBouncer)?

- **Connection pooling** keeps a cache of open database connections that can be reused across client requests.  
- PostgreSQL spawns a **separate process per connection**, which is relatively heavy.  
- **pgBouncer** acts as a lightweight middleware, multiplexing thousands of client connections onto a small pool of actual PostgreSQL back‑end connections, reducing CPU/memory overhead and preventing connection exhaustion.

---

## 18. What is the difference between VARCHAR and TEXT in PostgreSQL?

| Type          | Length Limit | Validation | Storage & Performance |
|---------------|--------------|------------|------------------------|
| **VARCHAR(n)**| Up to **n** characters | Enforces max length (error if exceeded) | Same internal representation as `TEXT`. |
| **TEXT**      | Unlimited    | No length check | Identical storage & performance as `VARCHAR`. |
| **VARCHAR** (no length) | Unlimited | Same as `TEXT` | Same as `TEXT`. |

Use `VARCHAR(n)` when a **business rule** requires a maximum length; otherwise `TEXT` is simpler.

---

## 19. What are constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) used for?

- **NOT NULL:** Disallows `NULL` values in a column.  
- **UNIQUE:** Guarantees all values in the column (or column set) are distinct.  
- **CHECK:** Enforces a Boolean expression on column values (e.g., `price >= 0`).  
- **FOREIGN KEY:** Maintains **referential integrity** by ensuring a value exists in the referenced table’s primary key.  
- Constraints provide **server‑side data integrity**, which is more reliable than application‑only validation.

---

## 20. What is a deadlock and how can it be avoided?

- A **deadlock** occurs when two or more transactions each hold locks the other needs, creating a circular wait.  
- PostgreSQL automatically **detects** deadlocks and aborts one transaction with an error (`ERROR: deadlock detected`).  
- **Avoidance strategies:**  
  - Access tables/rows in a **consistent order** across all transactions.  
  - Keep transactions **short** and lock‑footprint minimal.  
  - Use appropriate lock levels (`SELECT … FOR UPDATE`) only when necessary.

---

## 21. What is the difference between horizontal and vertical scaling for a PostgreSQL database?

| Scaling Type | Description | Advantages | Limitations |
|-------------|-------------|------------|--------------|
| **Vertical (scale‑up)** | Add more CPU, RAM, or faster storage to a single server. | Simple to implement; no application changes. | Hardware limits; single point of failure. |
| **Horizontal (scale‑out)** | Distribute data across multiple servers via **replication**, **partitioning**, or **sharding**. | Improves read throughput, fault tolerance, and can handle larger datasets. | More complex architecture; requires logical replication, FDW, or extensions like **Citus**. |

---

## 22. What is a trigger in PostgreSQL and when would you use one?

- A **trigger** is a function that automatically runs **before**, **after**, or **instead of** `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` events on a table.  
- **Typical uses:**  
  - **Audit logging** (track changes).  
  - Enforcing complex **business rules** that cannot be expressed with constraints.  
  - Maintaining **derived or summary tables**.  
- Overusing triggers can make debugging harder; prefer application logic unless database‑level enforcement is essential.

---

## 23. What is JSONB in PostgreSQL and how does it differ from JSON?

| Feature          | **JSON**                              | **JSONB**                              |
|------------------|---------------------------------------|----------------------------------------|
| Storage Format   | Plain text (preserves whitespace & key order). | Binary decomposed format (no whitespace, key order not preserved). |
| Indexing         | No native indexing; slower parsing.   | Supports **GIN** and **BTREE** indexes; fast queries. |
| Mutability       | Stores duplicate keys as‑is.           | Removes duplicate keys (last wins).   |
| Performance      | Slower for read‑heavy workloads.      | Faster for search, extraction, and indexing. |

Use **JSONB** for queryable JSON data; **JSON** only when you need to preserve exact input format.

---

## 24. What is database replication and how does PostgreSQL implement it?

- **Replication** copies data from a **primary** server to one or more **replicas**.  
- **Streaming replication** ships the **WAL** (Write‑Ahead Log) to replicas in near‑real‑time; replicas apply changes continuously.  
- **Logical replication** allows selective table replication and cross‑version compatibility via **publications** and **subscriptions**.  
- **Cascading replication** lets a replica act as a source for additional replicas, enabling multi‑level scaling.

---

## 25. What is the N+1 query problem and how would you solve it?

- The **N+1 problem** occurs when an application issues one query to fetch a list of **N** rows, then runs an additional query for each row to retrieve related data (total **N + 1** queries).  
- **Solutions:**  
  - Use **JOINs** to retrieve parent and child data in a single query.  
  - Apply **eager loading** (e.g., ORM `include`/`relations` options).  
  - Perform **batch loading** (`WHERE foreign_id IN (…)`) to fetch related rows in fewer queries.  

---

## 26. How does PostgreSQL handle full-text search?

- Uses **`tsvector`** (tokenized document) and **`tsquery`** (search query) data types.  
- Supports **stemming**, **stop‑word removal**, and language‑specific dictionaries.  
- Query with the `@@` operator; rank results with `ts_rank`.  
- Create a **GIN index** on the `tsvector` column for fast search.  
- For very large or complex search requirements, consider external engines like **Elasticsearch**.

---

## 27. What is the difference between a primary key and a foreign key?

| Aspect            | **Primary Key**                              | **Foreign Key**                                   |
|-------------------|----------------------------------------------|---------------------------------------------------|
| Uniqueness        | Must be **unique** for every row.            | May contain duplicate values.                     |
| Nullability       | **NOT NULL** required.                        | Can be **NULL** unless explicitly prohibited.      |
| Purpose           | Guarantees **entity integrity** within the table. | Enforces **referential integrity** to another table. |
| Definition Scope  | Defined on the table itself.                 | References a primary (or unique) key in another table. |

---