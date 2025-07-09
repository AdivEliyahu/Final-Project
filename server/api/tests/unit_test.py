import json
from django.test import SimpleTestCase, Client
from db_connection import db
from copy import deepcopy
from api.views.models_views import (
    find_regex, find_entities_by_regex,
    remove_duplicate_entities, get_entities,
    replace_entities
)

class TestLogin(SimpleTestCase):
    def setUp(self):
        self.client = Client()
        self.users_collection = db['users']
        self.user_data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        self.users_collection.delete_many({'email': self.user_data['email']}) 

    def tearDown(self):
        self.users_collection.delete_many({'email': self.user_data['email']})

    # REGISTER TESTS
    def test_register_success(self):
        response = self.client.post('/register', data=json.dumps(self.user_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn('access', data)
        self.assertIn('refresh', data)
        self.assertEqual(data['user']['email'], self.user_data['email'])

    def test_register_existing_email(self):
        self.users_collection.insert_one(self.user_data)
        clean_user_data = deepcopy(self.user_data)
        clean_user_data.pop('_id', None)
        response = self.client.post('/register', data=json.dumps(clean_user_data), content_type='application/json')
        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_register_invalid_json(self):
        response = self.client.post('/register', data="{bad json}", content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_register_missing_fields(self):
        incomplete_data = {'email': self.user_data['email']}
        response = self.client.post('/register', data=json.dumps(incomplete_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)  
        self.assertIn('user', response.json())

    # LOGIN TESTS
    def test_login_success(self):
        self.users_collection.insert_one(self.user_data)
        response = self.client.post('/login', data=json.dumps({
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
        self.assertIn('user', response.json())

    def test_login_wrong_password(self):
        self.users_collection.insert_one(self.user_data)
        response = self.client.post('/login', data=json.dumps({
            'email': self.user_data['email'],
            'password': 'wrongpass'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())

    def test_login_nonexistent_email(self):
        response = self.client.post('/login', data=json.dumps({
            'email': 'notfound@example.com',
            'password': 'irrelevant'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())

    def test_login_missing_fields(self):
        self.users_collection.insert_one(self.user_data)
        response = self.client.post('/login', data=json.dumps({
            'email': self.user_data['email']
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())



class AnonymizationTests(SimpleTestCase):

    def setUp(self):
        self.text = "Hello, my name is John Doe. My email is john.doe@example.com and my phone is +1 123-456-7890."

    def test_find_regex_email(self):
        entities = find_regex(self.text, "EMAIL", r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b')
        self.assertEqual(len(entities), 1)
        self.assertEqual(entities[0][1], "EMAIL")

    def test_find_regex_phone(self):
        entities = find_regex(self.text, "CODE", r'\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}')
        self.assertEqual(len(entities), 1)
        self.assertEqual(entities[0][1], "CODE")

    def test_find_entities_by_regex_adds_both(self):
        entities = find_entities_by_regex(self.text, [])
        labels = [e[1] for e in entities]
        self.assertIn("EMAIL", labels)
        self.assertIn("CODE", labels)

    def test_remove_duplicate_entities_prefers_spacy(self):
        regex_entity = ["123-456", "CODE", 10, 18, "regex"]
        spacy_entity = ["123-456", "CODE", 10, 18, "spacy"]
        result = remove_duplicate_entities([regex_entity, spacy_entity])
        self.assertEqual(result[0][4], "spacy")

    def test_get_entities_returns_json(self):
        result = get_entities(self.text)
        parsed = json.loads(result)
        self.assertIn("text", parsed)
        self.assertIn("entities", parsed)

    def test_replace_entities(self):
        response = json.dumps([
            {
                "span_text": "john.doe@example.com",
                "start_offset": self.text.index("john.doe@example.com"),
                "end_offset": self.text.index("john.doe@example.com") + len("john.doe@example.com"),
                "identifier_type": "DIRECT",
                "entity_type": "EMAIL",
                "reason": "Personal email"
            }
        ])
        replaced = replace_entities(response, self.text)
        self.assertIn("<EMAIL>", replaced)
        self.assertNotIn("john.doe@example.com", replaced)

    