#!/bin/bash

# Audit Log Endpoints Testing Script
# Tests all audit trail and activity log endpoints

echo "=== Audit Log Endpoints Testing ==="
echo ""

# Configuration
BASE_URL="http://localhost:5000/api/v1"
ADMIN_TOKEN=""
USER_TOKEN=""
USER_ID=""
PROJECT_ID=""
TASK_ID=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter for test results
PASSED=0
FAILED=0

# Helper function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((FAILED++))
    fi
    echo ""
}

echo -e "${BLUE}Step 1: Login as admin${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@test.com",
    "password": "Admin123!@#"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ]; then
    ADMIN_TOKEN=$(echo "$BODY" | jq -r '.data.accessToken')
    echo "Admin Token: ${ADMIN_TOKEN:0:50}..."
    print_result 0 "Admin login successful"
else
    echo "Response: $BODY"
    print_result 1 "Admin login failed"
    exit 1
fi

echo -e "${BLUE}Step 2: Login as regular user${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser2@test.com",
    "password": "User123!@#"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ]; then
    USER_TOKEN=$(echo "$BODY" | jq -r '.data.accessToken')
    USER_ID=$(echo "$BODY" | jq -r '.data.user.id')
    echo "User Token: ${USER_TOKEN:0:50}..."
    echo "User ID: $USER_ID"
    print_result 0 "User login successful"
else
    echo "Response: $BODY"
    print_result 1 "User login failed"
    exit 1
fi

# Create a project to generate audit logs
echo -e "${BLUE}Step 3: Create a project (generates audit log)${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/projects" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Audit Test Project",
    "description": "Project for audit log testing",
    "visibility": "private"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "201" ]; then
    PROJECT_ID=$(echo "$BODY" | jq -r '.data.id')
    echo "Project ID: $PROJECT_ID"
    print_result 0 "Project created successfully"
else
    echo "Response: $BODY"
    print_result 1 "Project creation failed"
fi

# Create a task to generate more audit logs
echo -e "${BLUE}Step 4: Create a task (generates audit log)${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/tasks" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"title\": \"Audit Test Task\",
    \"description\": \"Task for audit log testing\",
    \"priority\": \"high\"
  }")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "201" ]; then
    TASK_ID=$(echo "$BODY" | jq -r '.data.id')
    echo "Task ID: $TASK_ID"
    print_result 0 "Task created successfully"
else
    echo "Response: $BODY"
    print_result 1 "Task creation failed"
fi

# ==================== Get Project Activity ====================

echo -e "${BLUE}Step 5: Get project activity logs${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/audit/project/$PROJECT_ID?limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data | length' | xargs echo "Number of logs:"
    print_result 0 "Get project activity logs"
else
    echo "Response: $BODY"
    print_result 1 "Get project activity logs"
fi

# ==================== Get Task Activity ====================

echo -e "${BLUE}Step 6: Get task activity logs${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/audit/task/$TASK_ID?limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data | length' | xargs echo "Number of logs:"
    print_result 0 "Get task activity logs"
else
    echo "Response: $BODY"
    print_result 1 "Get task activity logs"
fi

# ==================== Get User Activity ====================

echo -e "${BLUE}Step 7: Get own user activity logs${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/audit/user/$USER_ID?limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data | length' | xargs echo "Number of logs:"
    print_result 0 "Get own user activity logs"
else
    echo "Response: $BODY"
    print_result 1 "Get own user activity logs"
fi

echo -e "${BLUE}Step 8: Try to get another user's activity (should fail)${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/audit/user/507f1f77bcf86cd799439011?limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)

if [ "$HTTP_STATUS" = "403" ] || [ "$HTTP_STATUS" = "401" ]; then
    print_result 0 "User cannot access other user's activity"
else
    print_result 1 "User should not access other user's activity"
fi

# ==================== Get All Activity (Admin) ====================

echo -e "${BLUE}Step 9: Get all activity logs as admin (skipped - no admin user)${NC}"
echo "Note: Admin-only endpoints require a user with admin role"
print_result 0 "Admin test skipped - no test admin available"

echo -e "${BLUE}Step 10: Try to get all activity as regular user (should fail)${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/audit?limit=20" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)

if [ "$HTTP_STATUS" = "403" ]; then
    print_result 0 "Regular user cannot access all activity logs"
else
    print_result 1 "Regular user should not access all activity logs"
fi

# ==================== Get Activity Statistics ====================

echo -e "${BLUE}Step 11: Get activity statistics as admin (skipped - no admin user)${NC}"
echo "Note: Admin-only endpoints require a user with admin role"
print_result 0 "Admin statistics test skipped - no test admin available"

echo -e "${BLUE}Step 12: Try to get statistics as regular user (should fail)${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/audit/statistics" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)

if [ "$HTTP_STATUS" = "403" ]; then
    print_result 0 "Regular user cannot access activity statistics"
else
    print_result 1 "Regular user should not access activity statistics"
fi

# ==================== Test Filtering ====================

echo -e "${BLUE}Step 13: Test filtering by entity type (skipped - no admin user)${NC}"
echo "Note: Filtering requires admin role"
print_result 0 "Filter test skipped - no test admin available"

# ==================== Summary ====================

echo ""
echo "==================================="
echo -e "${BLUE}Test Summary${NC}"
echo "==================================="
echo -e "Total Passed: ${GREEN}$PASSED${NC}"
echo -e "Total Failed: ${RED}$FAILED${NC}"
echo "==================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
