# 🔼 Upload Flow (Chunked & Resumable)

---

## 🧭 Sequence Diagram

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant DB
    participant Node as Storage Node
    participant Queue

    Client->>API: Create File
    API->>DB: Insert File (status=uploading)
    API-->>Client: fileId

    loop For each chunk
        Client->>API: Request upload target
        API->>DB: Select storage node
        API-->>Client: Upload URL

        Client->>Node: Upload chunk
        Node-->>API: Confirm upload

        API->>DB: Save chunk metadata
    end

    API->>DB: Mark file COMPLETE
    API->>Queue: Trigger replication job
```

---

## ⚙️ Steps Explained

1. Client creates file record
2. File split into chunks (e.g., 5MB)
3. Each chunk uploaded independently
4. Metadata stored per chunk
5. File marked complete after all chunks uploaded
6. Background replication starts

---

## 🚀 Key Benefits

* Resume uploads
* Parallel uploads
* Efficient retries
