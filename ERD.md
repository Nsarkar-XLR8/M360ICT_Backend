# Entity Relationship Diagram (ERD)

Here is the Entity Relationship Diagram representing the database schema for the HR Management API.

```mermaid
erDiagram
    %% Core HR Admins
    hr_users {
        INT id PK
        VARCHAR email "UNIQUE"
        VARCHAR password_hash
        VARCHAR name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% Employee Records
    employees {
        INT id PK
        VARCHAR name
        INT age
        VARCHAR designation
        DATE hiring_date
        DATE date_of_birth
        DECIMAL salary
        VARCHAR photo_path "Nullable"
        TIMESTAMP deleted_at "Nullable (Soft Delete)"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% Attendance Records
    attendance {
        INT id PK
        INT employee_id FK "UNIQUE with date"
        DATE date "UNIQUE with employee_id"
        TIME check_in_time
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% Relationships
    employees ||--o{ attendance : "has many"
```

## Overview of Relationships

1. **`hr_users`**: This table is standalone. It is used to authenticate the internal HR staff manipulating the system via the `/api/v1/auth/login` endpoint.
2. **`employees`**: The central operational table. It contains a `has many` (one-to-many) relationship with the `attendance` table. If an employee is deleted, their attendance records are cascade-deleted.
3. **`attendance`**: Contains a foreign key `employee_id` referencing the `employees` table. There is a composite unique constraint on `(employee_id, date)` to ensure an employee can only have one check-in record per day.
