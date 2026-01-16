#!/bin/bash

# Test User Management Endpoints
# This script tests all user management endpoints

BASE_URL="http://localhost:5000/api/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Testing User Management Endpoints${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Step 1: Register a regular user
echo -e "${YELLOW}1. Register a new user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }')
echo "$REGISTER_RESPONSE" | jq .

USER_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.accessToken')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.id')

if [ "$USER_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ User registered successfully${NC}\n"
else
  echo -e "${RED}✗ User registration failed${NC}\n"
fi

# Step 2: Register an admin user
echo -e "${YELLOW}2. Register an admin user...${NC}"
ADMIN_REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!@#",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }')
echo "$ADMIN_REGISTER_RESPONSE" | jq .

ADMIN_TOKEN=$(echo "$ADMIN_REGISTER_RESPONSE" | jq -r '.data.accessToken')
ADMIN_ID=$(echo "$ADMIN_REGISTER_RESPONSE" | jq -r '.data.user.id')

if [ "$ADMIN_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Admin registered successfully${NC}\n"
else
  echo -e "${RED}✗ Admin registration failed${NC}\n"
fi

# Step 3: Get user profile
echo -e "${YELLOW}3. Get user profile (authenticated)...${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "$PROFILE_RESPONSE" | jq .

if [ "$(echo "$PROFILE_RESPONSE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ Profile retrieved successfully${NC}\n"
else
  echo -e "${RED}✗ Profile retrieval failed${NC}\n"
fi

# Step 4: Update user profile
echo -e "${YELLOW}4. Update user profile...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "avatar": "https://example.com/avatar.jpg"
  }')
echo "$UPDATE_RESPONSE" | jq .

if [ "$(echo "$UPDATE_RESPONSE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ Profile updated successfully${NC}\n"
else
  echo -e "${RED}✗ Profile update failed${NC}\n"
fi

# Step 5: Get all users (should fail for regular user)
echo -e "${YELLOW}5. Get all users as regular user (should fail)...${NC}"
LIST_USERS_FAIL=$(curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "$LIST_USERS_FAIL" | jq .

if [ "$(echo "$LIST_USERS_FAIL" | jq -r '.success')" == "false" ]; then
  echo -e "${GREEN}✓ Access correctly denied for regular user${NC}\n"
else
  echo -e "${RED}✗ Should have denied access${NC}\n"
fi

# Step 6: Get all users as admin
echo -e "${YELLOW}6. Get all users as admin (should succeed)...${NC}"
LIST_USERS_SUCCESS=$(curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$LIST_USERS_SUCCESS" | jq .

if [ "$(echo "$LIST_USERS_SUCCESS" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ Users listed successfully${NC}\n"
else
  echo -e "${RED}✗ User listing failed${NC}\n"
fi

# Step 7: Update user role (admin only)
echo -e "${YELLOW}7. Update user role to admin (admin action)...${NC}"
UPDATE_ROLE_RESPONSE=$(curl -s -X PUT "$BASE_URL/users/$USER_ID/role" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }')
echo "$UPDATE_ROLE_RESPONSE" | jq .

if [ "$(echo "$UPDATE_ROLE_RESPONSE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ User role updated successfully${NC}\n"
else
  echo -e "${RED}✗ Role update failed${NC}\n"
fi

# Step 8: Try to change own role (should fail)
echo -e "${YELLOW}8. Try to change own role (should fail)...${NC}"
CHANGE_OWN_ROLE=$(curl -s -X PUT "$BASE_URL/users/$ADMIN_ID/role" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user"
  }')
echo "$CHANGE_OWN_ROLE" | jq .

if [ "$(echo "$CHANGE_OWN_ROLE" | jq -r '.success')" == "false" ]; then
  echo -e "${GREEN}✓ Correctly prevented self role change${NC}\n"
else
  echo -e "${RED}✗ Should have prevented self role change${NC}\n"
fi

# Step 9: Deactivate user (admin only)
echo -e "${YELLOW}9. Deactivate user account (admin action)...${NC}"
DEACTIVATE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$DEACTIVATE_RESPONSE" | jq .

if [ "$(echo "$DEACTIVATE_RESPONSE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ User deactivated successfully${NC}\n"
else
  echo -e "${RED}✗ User deactivation failed${NC}\n"
fi

# Step 10: Try to use deactivated user's token (should fail)
echo -e "${YELLOW}10. Try to access with deactivated user token (should fail)...${NC}"
DEACTIVATED_ACCESS=$(curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "$DEACTIVATED_ACCESS" | jq .

if [ "$(echo "$DEACTIVATED_ACCESS" | jq -r '.success')" == "false" ]; then
  echo -e "${GREEN}✓ Correctly denied access for deactivated user${NC}\n"
else
  echo -e "${RED}✗ Should have denied access for deactivated user${NC}\n"
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}User Management Tests Complete!${NC}"
echo -e "${YELLOW}========================================${NC}"
