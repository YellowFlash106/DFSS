# 🗄️ Database Design

---

## 📊 ER Diagram

```mermaid
erDiagram
    User ||--o{ File : owns
    File ||--o{ Chunk : contains
    Chunk }o--|| StorageNode : stored_in

    User {
        int id
        string email
        string password
        datetime createdAt
    }

    File {
        int id
        int userId
        string filename
        int size
        string status
        datetime createdAt
    }

    Chunk {
        int id
        int fileId
        int chunkIndex
        int storageNodeId
        string path
        string checksum
    }

    StorageNode {
        int id
        string url
        int capacity
        string status
    }
```

---

## 🧩 Tables

### User

* Stores authentication data

### File

* Represents uploaded file
* Tracks upload status

### Chunk

* Represents a piece of file
* Maps to storage node

### StorageNode

* Represents physical storage server

---

## ⚡ Indexing

* `file.userId`
* `chunk.fileId`
* `(fileId, chunkIndex)` composite

---

## 🧠 Notes

* No actual file stored in DB
* Only metadata + references
* Chunk checksum ensures integrity
