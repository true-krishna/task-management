#!/bin/bash

# Task Management Test Script
# Tests all task-related API endpoints

BASE_URL="http://localhost:5000/api/v1"
TOKEN=""
USER_ID=""
PROJECT_ID=""
TASK_ID=""
TASK_ID_2=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Task Management API Test"
echo "========================================="
echo ""

# Step 1: Register a test user
echo -e "${YELLOW}Step 1: Registering test user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tasktest@example.com",
    "password": "TestPass123!",
    "username": "tasktester",
    "firstName": "Task",
    "lastName": "Tester"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Step 2: Login
echo -e "${YELLOW}Step 2: Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tasktest@example.com",
    "password": "TestPass123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed - no token received${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo "Token: ${TOKEN:0:20}..."
echo "User ID: $USER_ID"
echo ""

# Step 3: Create a project
echo -e "${YELLOW}Step 3: Creating a project...${NC}"
PROJECT_RESPONSE=$(curl -s -X POST "${BASE_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Task Test Project",
    "description": "Project for testing task management",
    "visibility": "private"
  }')

PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}✗ Project creation failed${NC}"
  echo "Response: $PROJECT_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Project created successfully${NC}"
echo "Project ID: $PROJECT_ID"
echo ""

# Step 4: Create a task (NOT_STARTED)
echo -e "${YELLOW}Step 4: Creating a task (not_started)...${NC}"
TASK_RESPONSE=$(curl -s -X POST "${BASE_URL}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\": \"Implement authentication\",
    \"description\": \"Create login and register endpoints\",
    \"projectId\": \"$PROJECT_ID\",
    \"status\": \"not_started\",
    \"priority\": \"high\"
  }")

TASK_ID=$(echo $TASK_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TASK_ID" ]; then
  echo -e "${RED}✗ Task creation failed${NC}"
  echo "Response: $TASK_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Task created successfully${NC}"
echo "Task ID: $TASK_ID"
echo "Response: $TASK_RESPONSE"
echo ""

# Step 5: Create a second task
echo -e "${YELLOW}Step 5: Creating a second task...${NC}"
TASK_RESPONSE_2=$(curl -s -X POST "${BASE_URL}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\": \"Design database schema\",
    \"description\": \"Create MongoDB schemas for all entities\",
    \"projectId\": \"$PROJECT_ID\",
    \"status\": \"in_progress\",
    \"priority\": \"medium\",
    \"assigneeId\": \"$USER_ID\"
  }")

TASK_ID_2=$(echo $TASK_RESPONSE_2 | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TASK_ID_2" ]; then
  echo -e "${RED}✗ Second task creation failed${NC}"
  echo "Response: $TASK_RESPONSE_2"
else
  echo -e "${GREEN}✓ Second task created successfully${NC}"
  echo "Task ID: $TASK_ID_2"
fi
echo ""

# Step 6: Get single task
echo -e "${YELLOW}Step 6: Getting single task...${NC}"
GET_TASK_RESPONSE=$(curl -s -X GET "${BASE_URL}/tasks/${TASK_ID}" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_TASK_RESPONSE"

if echo "$GET_TASK_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task retrieved successfully${NC}"
else
  echo -e "${RED}✗ Failed to retrieve task${NC}"
fi
echo ""

# Step 7: Get all tasks for project
echo -e "${YELLOW}Step 7: Getting all tasks for project...${NC}"
GET_PROJECT_TASKS_RESPONSE=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/tasks" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_PROJECT_TASKS_RESPONSE"

if echo "$GET_PROJECT_TASKS_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Project tasks retrieved successfully${NC}"
else
  echo -e "${RED}✗ Failed to retrieve project tasks${NC}"
fi
echo ""

# Step 8: Update task
echo -e "${YELLOW}Step 8: Updating task...${NC}"
UPDATE_TASK_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/tasks/${TASK_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Implement authentication (UPDATED)",
    "description": "Create login, register, and logout endpoints",
    "priority": "medium"
  }')

echo "Response: $UPDATE_TASK_RESPONSE"

if echo "$UPDATE_TASK_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task updated successfully${NC}"
else
  echo -e "${RED}✗ Failed to update task${NC}"
fi
echo ""

# Step 9: Update task status (move to IN_PROGRESS)
echo -e "${YELLOW}Step 9: Updating task status to in_progress...${NC}"
UPDATE_STATUS_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/tasks/${TASK_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "in_progress"
  }')

echo "Response: $UPDATE_STATUS_RESPONSE"

if echo "$UPDATE_STATUS_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task status updated successfully${NC}"
else
  echo -e "${RED}✗ Failed to update task status${NC}"
fi
echo ""

# Step 10: Update task priority
echo -e "${YELLOW}Step 10: Updating task priority to low...${NC}"
UPDATE_PRIORITY_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/tasks/${TASK_ID}/priority" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "priority": "low"
  }')

echo "Response: $UPDATE_PRIORITY_RESPONSE"

if echo "$UPDATE_PRIORITY_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task priority updated successfully${NC}"
else
  echo -e "${RED}✗ Failed to update task priority${NC}"
fi
echo ""

# Step 11: Assign task
echo -e "${YELLOW}Step 11: Assigning task to user...${NC}"
ASSIGN_TASK_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/tasks/${TASK_ID}/assign" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"assigneeId\": \"$USER_ID\"
  }")

echo "Response: $ASSIGN_TASK_RESPONSE"

if echo "$ASSIGN_TASK_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task assigned successfully${NC}"
else
  echo -e "${RED}✗ Failed to assign task${NC}"
fi
echo ""

# Step 12: Reorder task (move to COMPLETED with order 0)
echo -e "${YELLOW}Step 12: Reordering task (move to completed)...${NC}"
REORDER_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/tasks/${TASK_ID}/reorder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "newStatus": "completed",
    "newOrder": 0
  }')

echo "Response: $REORDER_RESPONSE"

if echo "$REORDER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task reordered successfully${NC}"
else
  echo -e "${RED}✗ Failed to reorder task${NC}"
fi
echo ""

# Step 13: Get all tasks again (should show in different columns)
echo -e "${YELLOW}Step 13: Getting all tasks after reordering...${NC}"
GET_PROJECT_TASKS_FINAL=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/tasks" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_PROJECT_TASKS_FINAL"

if echo "$GET_PROJECT_TASKS_FINAL" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Final project tasks retrieved successfully${NC}"
else
  echo -e "${RED}✗ Failed to retrieve final project tasks${NC}"
fi
echo ""

# Step 14: Filter tasks by status
echo -e "${YELLOW}Step 14: Filtering tasks by status (completed)...${NC}"
FILTER_STATUS_RESPONSE=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/tasks?status=completed" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $FILTER_STATUS_RESPONSE"

if echo "$FILTER_STATUS_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Tasks filtered by status successfully${NC}"
else
  echo -e "${RED}✗ Failed to filter tasks by status${NC}"
fi
echo ""

# Step 15: Filter tasks by priority
echo -e "${YELLOW}Step 15: Filtering tasks by priority (medium)...${NC}"
FILTER_PRIORITY_RESPONSE=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/tasks?priority=medium" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $FILTER_PRIORITY_RESPONSE"

if echo "$FILTER_PRIORITY_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Tasks filtered by priority successfully${NC}"
else
  echo -e "${RED}✗ Failed to filter tasks by priority${NC}"
fi
echo ""

# Step 16: Filter tasks by assignee
echo -e "${YELLOW}Step 16: Filtering tasks by assignee...${NC}"
FILTER_ASSIGNEE_RESPONSE=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/tasks?assigneeId=${USER_ID}" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $FILTER_ASSIGNEE_RESPONSE"

if echo "$FILTER_ASSIGNEE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Tasks filtered by assignee successfully${NC}"
else
  echo -e "${RED}✗ Failed to filter tasks by assignee${NC}"
fi
echo ""

# Step 17: Delete task
echo -e "${YELLOW}Step 17: Deleting task...${NC}"
DELETE_TASK_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/tasks/${TASK_ID_2}" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $DELETE_TASK_RESPONSE"

if echo "$DELETE_TASK_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Task deleted successfully${NC}"
else
  echo -e "${RED}✗ Failed to delete task${NC}"
fi
echo ""

# Final Summary
echo "========================================="
echo -e "${GREEN}Task Management Test Complete!${NC}"
echo "========================================="
echo ""
echo "Summary:"
echo "- User ID: $USER_ID"
echo "- Project ID: $PROJECT_ID"
echo "- Task 1 ID: $TASK_ID"
echo "- Task 2 ID: $TASK_ID_2 (deleted)"
echo ""
echo "All major task endpoints tested:"
echo "✓ Create task"
echo "✓ Get single task"
echo "✓ Get all project tasks"
echo "✓ Update task"
echo "✓ Update task status"
echo "✓ Update task priority"
echo "✓ Assign task"
echo "✓ Reorder task (Kanban drag-and-drop)"
echo "✓ Filter tasks (status, priority, assignee)"
echo "✓ Delete task"
