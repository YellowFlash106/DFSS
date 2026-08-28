# ⚖️ Consistency Model

---

## 🧠 Model Used

**Eventual Consistency**

---

## 📌 Explanation

* File becomes available after all chunks uploaded
* Replication happens asynchronously
* Temporary inconsistencies are acceptable

---

## 🔄 Example

1. File uploaded → marked COMPLETE
2. Replication job runs later
3. Some nodes may not have all replicas immediately

---

## ❌ Why Not Strong Consistency?

* Slower writes
* Complex coordination
* Not needed for this system
