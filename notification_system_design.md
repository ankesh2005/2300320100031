# Stage 1 - Notification System Design

## Overview

The Campus Notification Platform allows students to view notifications related to:

* Placements
* Results
* Events

The system contains:

* React Frontend
* Express Backend
* Logging Middleware
* External Notification API

---

## System Architecture

```text
Frontend (React + Material UI)
            |
            v
Backend (Node.js + Express)
            |
            v
Affordmed Notification API
```

---

## APIs

### Get Notifications

```http
GET /api/notifications
```

Query Parameters:

| Parameter         | Description              |
| ----------------- | ------------------------ |
| page              | Page Number              |
| limit             | Number of records        |
| notification_type | Placement, Result, Event |

Example:

```http
GET /api/notifications?page=1&limit=10
```

Response:

```json
{
  "success": true,
  "count": 10,
  "notifications": []
}
```

---

### Get Priority Notifications

```http
GET /api/notifications/priority?top=10
```

Response:

```json
{
  "success": true,
  "count": 10,
  "notifications": []
}
```

---

## Logging Middleware

A reusable logging middleware was developed.

Function:

```js
Log(
  stack,
  level,
  packageName,
  message
)
```

Example:

```js
Log(
  "backend",
  "info",
  "controller",
  "Fetching notifications"
)
```

The middleware sends logs to the evaluation logging API.

---

# Stage 2 - Data Storage Design

In the current implementation notifications are fetched from the provided Notification API.

For a production system I would use PostgreSQL.

## Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  student_id INT,
  notification_type VARCHAR(20),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

---

## Sample Query

Fetch notifications:

```sql
SELECT *
FROM notifications
WHERE student_id = 101
ORDER BY created_at DESC;
```

Fetch unread notifications:

```sql
SELECT *
FROM notifications
WHERE student_id = 101
AND is_read = FALSE;
```

---

# Stage 3 - Query Optimization

Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

## Why It Becomes Slow

As the number of notifications increases:

* More records need to be scanned.
* Sorting becomes expensive.
* Query execution time increases.

## Solution

Create a composite index:

```sql
CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt);
```

This reduces search time significantly.

---

## Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4 - Performance Improvement

## Problem

Fetching notifications from the database on every page request increases load.

## Solutions

### Pagination

Only required notifications are fetched.

Example:

```http
GET /api/notifications?page=1&limit=10
```

### Filtering

Students can filter:

* Placement
* Result
* Event

This reduces unnecessary data transfer.

### Caching

Redis can be added to cache frequently requested notifications.

---

# Stage 5 - Notify All Design

Current Approach

```python
for student in students:
    send_email()
    save_to_db()
    push_to_app()
```

Problems:

* Slow
* Sequential processing
* No retry mechanism

---

## Improved Design

Use Queue-Based Processing.

Architecture:

```text
HR
 |
 v
Notification Service
 |
 v
Queue
 |
 +---- Email Worker
 |
 +---- Push Worker
```

Benefits:

* Faster execution
* Better reliability
* Retry support

---

# Stage 6 - Priority Inbox

The application includes a Priority Inbox feature.

Priority Order:

```text
Placement > Result > Event
```

Weights:

```text
Placement = 3
Result = 2
Event = 1
```

## Priority Algorithm

Score:

```text
Priority Score =
Weight + Recency
```

Notifications are sorted by score and the top notifications are returned.

Example:

```text
#1 Placement Notification
#2 Placement Notification
#3 Result Notification
#4 Event Notification
```

## Complexity

Current Implementation:

```text
O(N log N)
```

Notifications are sorted and the top N notifications are returned.
