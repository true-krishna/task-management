#!/bin/bash

# Dashboard Endpoints Testing Script
# Tests all dashboard and analytics endpoints

echo "=== Dashboard Endpoints Testing ==="
echo ""

# Configuration
BASE_URL="http://localhost:5000/api/v1"
ADMIN_TOKEN=""
USER_TOKEN=""

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

# Helper function to check response status
check_status() {
    local response="$1"
    local expected_status=$2
    local actual_status=$(echo "$response" | grep "HTTP/" | awk '{print $2}')
    
    if [ "$actual_status" = "$expected_status" ]; then
        return 0
    else
        echo "Expected status: $expected_status, Got: $actual_status"
        return 1
    fi
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
    ADMIN_TOKEN=$(echo "$BODY" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
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
    USER_TOKEN=$(echo "$BODY" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo "User Token: ${USER_TOKEN:0:50}..."
    print_result 0 "User login successful"
else
    echo "Response: $BODY"
    print_result 1 "User login failed"
    exit 1
fi

# ==================== Dashboard Statistics ====================

echo -e "${BLUE}Step 3: Get dashboard stats as user${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data | {totalProjects, totalTasks, completionRate, myTasks, overdueTasks}'
    print_result 0 "Get dashboard stats as user"
else
    echo "Response: $BODY"
    print_result 1 "Get dashboard stats as user"
fi

echo -e "${BLUE}Step 4: Get dashboard stats as admin${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data | {totalProjects, totalTasks, completionRate, myTasks, overdueTasks}'
    print_result 0 "Get dashboard stats as admin"
else
    echo "Response: $BODY"
    print_result 1 "Get dashboard stats as admin"
fi

echo -e "${BLUE}Step 5: Get dashboard stats without authentication${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/stats")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)

if [ "$HTTP_STATUS" = "401" ]; then
    print_result 0 "Dashboard stats requires authentication"
else
    print_result 1 "Dashboard stats should require authentication"
fi

# ==================== Task Distribution ====================

echo -e "${BLUE}Step 6: Get task distribution as user${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/task-distribution" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data'
    print_result 0 "Get task distribution as user"
else
    echo "Response: $BODY"
    print_result 1 "Get task distribution as user"
fi

echo -e "${BLUE}Step 7: Get task distribution as admin${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/task-distribution" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data'
    print_result 0 "Get task distribution as admin"
else
    echo "Response: $BODY"
    print_result 1 "Get task distribution as admin"
fi

# ==================== Priority Distribution ====================

echo -e "${BLUE}Step 8: Get priority distribution as user${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/priority-distribution" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data'
    print_result 0 "Get priority distribution as user"
else
    echo "Response: $BODY"
    print_result 1 "Get priority distribution as user"
fi

echo -e "${BLUE}Step 9: Get priority distribution as admin${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/priority-distribution" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data'
    print_result 0 "Get priority distribution as admin"
else
    echo "Response: $BODY"
    print_result 1 "Get priority distribution as admin"
fi

# ==================== Weekly Trend ====================

echo -e "${BLUE}Step 10: Get weekly trend as user${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/weekly-trend" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data.summary'
    print_result 0 "Get weekly trend as user"
else
    echo "Response: $BODY"
    print_result 1 "Get weekly trend as user"
fi

echo -e "${BLUE}Step 11: Get weekly trend as admin${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/weekly-trend" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
    echo "$BODY" | jq '.data.summary'
    print_result 0 "Get weekly trend as admin"
else
    echo "Response: $BODY"
    print_result 1 "Get weekly trend as admin"
fi

# ==================== Cache Testing ====================

echo -e "${BLUE}Step 12: Test caching - Multiple requests should return cached data${NC}"
echo "Making 3 consecutive requests to stats endpoint..."

for i in {1..3}; do
    START_TIME=$(date +%s%N)
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/dashboard/stats" \
      -H "Authorization: Bearer $USER_TOKEN")
    END_TIME=$(date +%s%N)
    ELAPSED=$(( ($END_TIME - $START_TIME) / 1000000 ))
    
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "Request $i: ${ELAPSED}ms"
    fi
done

print_result 0 "Cache functionality test completed"

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
