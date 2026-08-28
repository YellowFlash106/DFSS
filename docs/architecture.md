# ⚡ Distributed File Storage System — Architecture

A scalable, distributed file storage platform inspired by **Google Drive + AWS S3**.

---

## 🗺️ High-Level Architecture

```mermaid
flowchart LR
    Client[Client (React)]
    API[API Server (Express)]
    DB[(PostgreSQL)]
    Redis[(Redis)]
    Queue[Queue (BullMQ)]
    Worker[Worker Service]
    Node1[Storage Node 1]
    Node2[Storage Node 2]

    Client --> API
    API --> DB
    API --> Redis
    API --> Queue

    Queue --> Worker

    API --> Node1
    API --> Node2

    Worker --> Node1
    Worker --> Node2
```

---

## 🧩 Core Components

### 🖥️ Client

* Handles file chunking
* Uploads chunks
* Downloads and reconstructs files

---

### ⚙️ API Server (Express)

* JWT Authentication
* File metadata management
* Chunk coordination
* Storage node selection

---

### 🗄️ PostgreSQL (Prisma)

Stores:

* Users
* Files
* Chunk metadata
* Storage nodes

---

### ⚡ Redis

* Caching file metadata
* Rate limiting
* Upload session tracking

---

### 🔁 Queue (BullMQ)

Handles async jobs:

* Replication
* Cleanup
* Background processing

---

### 🧠 Workers

* Execute queue jobs
* Handle replication
* Ensure system consistency

---

### 💾 Storage Nodes

* Store file chunks
* Serve downloads
* Scalable horizontally

---

## 🔄 Data Flow

### Upload

Client → API → Storage Node → DB → Queue

### Download

Client ← API (metadata) ← DB
Client → Storage Nodes (parallel)

---

## 🧱 Design Principles

* Separation of metadata and file data
* Horizontal scalability
* Fault tolerance via replication
* Async processing for heavy operations
