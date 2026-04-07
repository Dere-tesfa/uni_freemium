# Database Schema

## Tables

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| phone | VARCHAR(20) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | DEFAULT 'student' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | |

**Roles:** 'student', 'admin'

### sheets (Exams)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| course_code | VARCHAR(50) | NOT NULL |
| university | VARCHAR(255) | NOT NULL |
| department | VARCHAR(255) | NOT NULL |
| year | INTEGER | NOT NULL |
| exam_type | VARCHAR(20) | DEFAULT 'mid' |
| semester | VARCHAR(10) | DEFAULT '1' |
| price | DECIMAL(10,2) | DEFAULT 0 |
| is_published | BOOLEAN | DEFAULT false |
| description | TEXT | |
| image_url | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | |

**exam_type:** 'mid', 'final', 'quiz', 'assignment'
**semester:** '1', '2'

### questions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| sheet_id | UUID | FOREIGN KEY -> sheets(id) |
| question_text | TEXT | NOT NULL |
| image_url | TEXT | |
| options | JSONB | NOT NULL |
| correct_answer | VARCHAR(10) | NOT NULL |
| explanation | TEXT | |
| lesson_content | TEXT | |
| order | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | |

**options format:** `[{"label": "A", "text": "Option A text"}, ...]`
**correct_answer:** 'A', 'B', 'C', or 'D'

### purchases
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY -> users(id) |
| sheet_id | UUID | FOREIGN KEY -> sheets(id) |
| status | VARCHAR(20) | DEFAULT 'pending' |
| screenshot_url | TEXT | |
| transaction_id | VARCHAR(100) | | (TeleBirr)
| payer_phone | VARCHAR(20) | | (TeleBirr)
| amount | DECIMAL(10,2) | NOT NULL |
| rejection_reason | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| approved_at | TIMESTAMP | |
| rejected_at | TIMESTAMP | |

**status:** 'pending', 'approved', 'rejected'

### settings
| Column | Type | Constraints |
|--------|------|-------------|
| key | VARCHAR(100) | PRIMARY KEY |
| value | TEXT | NOT NULL |
| description | TEXT | |
| updated_at | TIMESTAMP | |

---

## Relationships

- User -> Purchases (one-to-many)
- Sheet -> Questions (one-to-many)
- Sheet -> Purchases (one-to-many)
- User -> Progress (one-to-many)
- User -> Bookmarks (one-to-many)

---

## Indexes

```sql
CREATE INDEX idx_sheets_published ON sheets(is_published);
CREATE INDEX idx_sheets_department ON sheets(department);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_user_sheet ON purchases(user_id, sheet_id);
CREATE INDEX idx_questions_sheet ON questions(sheet_id);
```

---

## Sample Data

### Create Student
```sql
INSERT INTO users (id, phone, email, password_hash, role)
VALUES (gen_random_uuid(), '+251912345679', 'student@test.com', '$2b$10$...', 'student');
```

### Create Sheet
```sql
INSERT INTO sheets (id, title, course_code, university, department, year, exam_type, semester, price, is_published)
VALUES (gen_random_uuid(), 'Data Structures', 'CS301', 'Woldia University', 'Computer Science', 2024, 'mid', '1', 200.00, true);
```

### Create Purchase
```sql
INSERT INTO purchases (id, user_id, sheet_id, status, amount, transaction_id, payer_phone)
VALUES (gen_random_uuid(), 'user-uuid', 'sheet-uuid', 'pending', 200.00, 'TN123456', '+251912345679');
```