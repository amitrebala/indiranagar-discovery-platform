# 3. COMMENT SYSTEM INTERFACE

## 3.1 Comment Component Design
Embedded below place details, journey pages, and blog posts:

```
┌──────────────────────────────────────────────────────┐
│  💬 Comments (12)                                      │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Add your comment:                                    │
│  ┌──────────────────────────────────────────────┐    │
│  │ Type your comment here...                     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Display name (optional): [Anonymous_____]           │
│  [Post Comment]                                       │
│                                                        │
├──────────────────────────────────────────────────────┤
│                                                        │
│  👤 Coffee Lover • 2 hours ago                       │
│  Great place for morning coffee! The ambiance is     │
│  perfect for working.                                │
│  [👍 5] [Reply]                                      │
│                                                        │
│     └─ 👤 Amit (Owner) • 1 hour ago                 │
│        Absolutely agree! I go there every Tuesday.   │
│        [👍 2]                                         │
│                                                        │
│  👤 Anonymous • 5 hours ago                          │
│  Bit crowded on weekends but worth it.              │
│  [👍 3] [Reply]                                      │
└──────────────────────────────────────────────────────┘
```

## 3.2 Admin Moderation View
```
┌──────────────────────────────────────────────────────┐
│  🛡️ This comment has been flagged (Admin Only)        │
│  [Approve] [Delete] [Ban IP]                         │
└──────────────────────────────────────────────────────┘
```

---
