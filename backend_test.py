import requests
import sys
import json
from datetime import datetime

class FunsomexAPITester:
    def __init__(self, base_url="https://nonprofitcolombia.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []
        self.auth_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Add auth header if required and token available
        if auth_required and self.auth_token:
            headers['Authorization'] = f'Bearer {self.auth_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if auth_required:
            print(f"   Auth: {'✓' if self.auth_token else '✗'}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.passed_tests.append(name)
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response: Dict with keys: {list(response_data.keys())[:5]}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            self.failed_tests.append({
                "test": name,
                "error": "Timeout after 30 seconds"
            })
            print(f"❌ Failed - Timeout after 30 seconds")
            return False, {}
        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_authentication(self):
        """Test authentication endpoints"""
        results = []
        
        # Test login with correct credentials
        login_data = {
            "email": "administracion@funsomex.com",
            "password": "SSs010616*+"
        }
        success, login_response = self.run_test("Admin Login (Correct)", "POST", "auth/login", 200, login_data)
        results.append(success)
        
        if success and 'token' in login_response:
            self.auth_token = login_response['token']
            print(f"   🔑 Auth token obtained: {self.auth_token[:20]}...")
            
            # Test token verification
            success, verify_response = self.run_test("Token Verification", "GET", "auth/verify", 200, auth_required=True)
            results.append(success)
            
            if success and 'email' in verify_response:
                print(f"   ✅ Token verified for: {verify_response['email']}")
        
        # Test login with incorrect credentials
        wrong_login_data = {
            "email": "wrong@email.com",
            "password": "wrongpassword"
        }
        success, _ = self.run_test("Admin Login (Wrong Email)", "POST", "auth/login", 401, wrong_login_data)
        results.append(success)
        
        # Test login with correct email but wrong password
        wrong_password_data = {
            "email": "administracion@funsomex.com",
            "password": "wrongpassword"
        }
        success, _ = self.run_test("Admin Login (Wrong Password)", "POST", "auth/login", 401, wrong_password_data)
        results.append(success)
        
        # Test protected endpoint without auth
        old_token = self.auth_token
        self.auth_token = None
        success, _ = self.run_test("Protected Endpoint (No Auth)", "GET", "contact", 401, auth_required=True)
        results.append(success)
        self.auth_token = old_token
        
        return all(results)

    def test_foundation_info(self):
        """Test foundation info endpoint"""
        success, response = self.run_test(
            "Foundation Info",
            "GET",
            "foundation-info",
            200
        )
        if success:
            required_fields = ['name', 'sigla', 'nit', 'mission', 'vision', 'values', 'services']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"⚠️  Missing fields: {missing_fields}")
        return success

    def test_news_endpoints(self):
        """Test news CRUD operations"""
        results = []
        
        # Get all news
        success, news_list = self.run_test("Get All News", "GET", "news", 200)
        results.append(success)
        
        # Create news
        news_data = {
            "title": "Test News Article",
            "content": "This is a test news article for FUNSOMEX testing.",
            "summary": "Test summary",
            "category": "general"
        }
        success, created_news = self.run_test("Create News", "POST", "news", 200, news_data, auth_required=True)
        results.append(success)
        
        if success and 'id' in created_news:
            news_id = created_news['id']
            
            # Get specific news
            success, _ = self.run_test("Get News by ID", "GET", f"news/{news_id}", 200)
            results.append(success)
            
            # Update news
            update_data = {"title": "Updated Test News"}
            success, _ = self.run_test("Update News", "PUT", f"news/{news_id}", 200, update_data, auth_required=True)
            results.append(success)
            
            # Delete news
            success, _ = self.run_test("Delete News", "DELETE", f"news/{news_id}", 200, auth_required=True)
            results.append(success)
        
        return all(results)

    def test_team_endpoints(self):
        """Test team CRUD operations"""
        results = []
        
        # Get all team members
        success, team_list = self.run_test("Get Team Members", "GET", "team", 200)
        results.append(success)
        
        # Create team member
        team_data = {
            "name": "Test Member",
            "role": "Test Role",
            "bio": "This is a test team member for FUNSOMEX testing.",
            "order": 1
        }
        success, created_member = self.run_test("Create Team Member", "POST", "team", 200, team_data, auth_required=True)
        results.append(success)
        
        if success and 'id' in created_member:
            member_id = created_member['id']
            
            # Delete team member
            success, _ = self.run_test("Delete Team Member", "DELETE", f"team/{member_id}", 200, auth_required=True)
            results.append(success)
        
        return all(results)

    def test_projects_endpoints(self):
        """Test projects CRUD operations"""
        results = []
        
        # Get all projects
        success, projects_list = self.run_test("Get Projects", "GET", "projects", 200)
        results.append(success)
        
        # Create project
        project_data = {
            "title": "Test Project",
            "description": "This is a test project for FUNSOMEX testing.",
            "image_url": "https://example.com/test.jpg",
            "category": "social",
            "location": "Test Location",
            "year": 2024
        }
        success, created_project = self.run_test("Create Project", "POST", "projects", 200, project_data, auth_required=True)
        results.append(success)
        
        if success and 'id' in created_project:
            project_id = created_project['id']
            
            # Delete project
            success, _ = self.run_test("Delete Project", "DELETE", f"projects/{project_id}", 200, auth_required=True)
            results.append(success)
        
        return all(results)

    def test_contact_endpoints(self):
        """Test contact endpoints"""
        results = []
        
        # Submit contact form
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message for FUNSOMEX testing."
        }
        success, created_contact = self.run_test("Submit Contact", "POST", "contact", 200, contact_data)
        results.append(success)
        
        # Get contacts (admin endpoint)
        success, contacts_list = self.run_test("Get Contacts", "GET", "contact", 200, auth_required=True)
        results.append(success)
        
        if success and created_contact and 'id' in created_contact:
            contact_id = created_contact['id']
            
            # Mark as read
            success, _ = self.run_test("Mark Contact Read", "PUT", f"contact/{contact_id}/read", 200, auth_required=True)
            results.append(success)
        
        return all(results)

    def test_external_news_endpoints(self):
        """Test external news endpoints"""
        results = []
        
        # Get external news
        success, external_news = self.run_test("Get External News", "GET", "external-news", 200)
        results.append(success)
        
        # Get news sources
        success, sources = self.run_test("Get News Sources", "GET", "news-sources", 200)
        results.append(success)
        
        # Refresh external news (background task)
        success, _ = self.run_test("Refresh External News", "POST", "external-news/refresh", 200)
        results.append(success)
        
        return all(results)

    def test_donation_endpoints(self):
        """Test PayPal donation endpoints"""
        results = []
        
        # Test donation stats
        success, stats = self.run_test("Get Donation Stats", "GET", "donations/stats", 200)
        results.append(success)
        if success:
            required_fields = ['total_amount', 'total_donations']
            missing_fields = [field for field in required_fields if field not in stats]
            if missing_fields:
                print(f"⚠️  Missing stats fields: {missing_fields}")
        
        # Test create PayPal payment
        donation_data = {
            "amount": 25.00,
            "currency": "USD",
            "donor_name": "Test Donor",
            "donor_email": "test@example.com",
            "message": "Test donation for FUNSOMEX"
        }
        success, payment_response = self.run_test("Create PayPal Payment", "POST", "donations/create-payment", 200, donation_data)
        results.append(success)
        if success:
            required_fields = ['success', 'payment_id', 'approval_url', 'donation_id']
            missing_fields = [field for field in required_fields if field not in payment_response]
            if missing_fields:
                print(f"⚠️  Missing payment response fields: {missing_fields}")
        
        # Test get donations (admin endpoint)
        success, donations_list = self.run_test("Get All Donations", "GET", "donations", 200, auth_required=True)
        results.append(success)
        
        return all(results)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("API Root", "GET", "", 200)[0]

def main():
    print("🚀 Starting FUNSOMEX API Testing...")
    print("=" * 50)
    
    tester = FunsomexAPITester()
    
    # Test authentication first (required for other tests)
    print("\n🔐 Testing Authentication...")
    auth_success = tester.test_authentication()
    if not auth_success:
        print("⚠️  Authentication tests failed - some protected endpoints may fail")
    
    # Test all endpoints
    print("\n📋 Testing Foundation Info...")
    tester.test_foundation_info()
    
    print("\n📰 Testing News Endpoints...")
    tester.test_news_endpoints()
    
    print("\n👥 Testing Team Endpoints...")
    tester.test_team_endpoints()
    
    print("\n📁 Testing Projects Endpoints...")
    tester.test_projects_endpoints()
    
    print("\n📧 Testing Contact Endpoints...")
    tester.test_contact_endpoints()
    
    print("\n🌐 Testing External News Endpoints...")
    tester.test_external_news_endpoints()
    
    print("\n💰 Testing Donation Endpoints...")
    tester.test_donation_endpoints()
    
    print("\n🏠 Testing Root Endpoint...")
    tester.test_root_endpoint()
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 FINAL RESULTS")
    print("=" * 50)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {len(tester.failed_tests)}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"  - {failure['test']}: {error_msg}")
    
    if tester.passed_tests:
        print(f"\n✅ PASSED TESTS ({len(tester.passed_tests)}):")
        for test in tester.passed_tests:
            print(f"  - {test}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())