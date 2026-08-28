# 🔽 Download Flow

---

## 🧭 Sequence Diagram

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant DB
    participant Node as Storage Nodes

    Client->>API: Request file
    API->>DB: Fetch chunk metadata

    API-->>Client: List of chunk URLs

    loop Parallel Download
        Client->>Node: Fetch chunk
        Node-->>Client: Chunk data
    end

    Client->>Client: Merge chunks
```

---

## ⚙️ Steps

1. Client requests file
2. API returns chunk locations
3. Client downloads chunks in parallel
4. Client reconstructs file

---

## 🚀 Benefits

* Faster downloads (parallel)
* Scalable read performance
