# 📌 Decision: Metadata vs File Storage

---

## Decision

* Metadata → PostgreSQL
* File Data → Storage Nodes

---

## Reason

* Databases are optimized for structured queries
* Large binary files degrade DB performance
* Storage nodes scale horizontally

---

## Outcome

* Fast queries
* Scalable storage
* Clean separation of concerns
