# 💥 Failure Model

---

## 🚨 Failure Scenarios

### 1. Chunk Upload Failure

* Retry only failed chunk
* No need to restart full upload

---

### 2. Storage Node Failure

* Use another node
* Use replicated chunks

---

### 3. Partial Upload

* Resume from last successful chunk

---

### 4. Worker Failure

* Queue retry mechanism

---

### 5. Database Failure

* Retry operations
* Use connection pooling

---

## 🛡️ Fault Tolerance Strategies

* Chunk-level retries
* Replication
* Queue retries
* Node health checks
