import json

from django.test import TestCase


class ApplicationWorkflowApiTests(TestCase):
    def post_json(self, url: str, payload: dict):
        return self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )

    def patch_json(self, url: str, payload: dict):
        return self.client.patch(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )

    def create_application(self):
        response = self.post_json(
            "/api/applications",
            {
                "applicant_name": "Amina Kibet",
                "applicant_email": "amina@example.com",
                "company_name": "Northstar Media Ltd",
                "application_type": "Recordation",
                "description": "New workflow application.",
            },
        )
        self.assertEqual(response.status_code, 201)
        return response.json()

    def test_create_list_detail_and_progress_through_workflow(self):
        created = self.create_application()
        application_id = created["id"]

        self.assertEqual(created["status"], "Draft")
        self.assertTrue(created["tracking_number"].startswith("APP-"))

        list_response = self.client.get("/api/applications")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        detail_response = self.client.get(f"/api/applications/{application_id}")
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.json()["applicant_name"], "Amina Kibet")

        update_response = self.patch_json(
            f"/api/applications/{application_id}",
            {
                "applicant_name": "Amina Kibet",
                "applicant_email": "amina@example.com",
                "company_name": "Northstar Media Ltd",
                "application_type": "Renewal",
                "description": "Updated description before submission.",
                "resubmit": False,
            },
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()["application_type"], "Renewal")

        submit_response = self.client.post(f"/api/applications/{application_id}/submit")
        self.assertEqual(submit_response.status_code, 200)
        self.assertEqual(submit_response.json()["status"], "Submitted")
        self.assertIsNotNone(submit_response.json()["submitted_at"])

        review_response = self.client.post(f"/api/applications/{application_id}/start-review")
        self.assertEqual(review_response.status_code, 200)
        self.assertEqual(review_response.json()["status"], "Under Review")

        decision_response = self.post_json(
            f"/api/applications/{application_id}/decision",
            {"decision": "Approved", "comment": ""},
        )
        self.assertEqual(decision_response.status_code, 200)
        self.assertEqual(decision_response.json()["status"], "Approved")
        self.assertIsNotNone(decision_response.json()["reviewed_at"])

    def test_need_more_information_requires_comment_and_allows_resubmit(self):
        created = self.create_application()
        application_id = created["id"]

        self.client.post(f"/api/applications/{application_id}/submit")
        self.client.post(f"/api/applications/{application_id}/start-review")

        missing_comment_response = self.post_json(
            f"/api/applications/{application_id}/decision",
            {"decision": "Need More Information", "comment": "   "},
        )
        self.assertEqual(missing_comment_response.status_code, 400)

        decision_response = self.post_json(
            f"/api/applications/{application_id}/decision",
            {
                "decision": "Need More Information",
                "comment": "Please attach the missing resolution.",
            },
        )
        self.assertEqual(decision_response.status_code, 200)
        self.assertEqual(decision_response.json()["status"], "Need More Information")

        resubmit_response = self.patch_json(
            f"/api/applications/{application_id}",
            {
                "applicant_name": "Amina Kibet",
                "applicant_email": "amina@example.com",
                "company_name": "Northstar Media Ltd",
                "application_type": "Renewal",
                "description": "Added the missing resolution.",
                "resubmit": True,
            },
        )
        self.assertEqual(resubmit_response.status_code, 200)
        self.assertEqual(resubmit_response.json()["status"], "Submitted")

    def test_invalid_state_transitions_are_rejected(self):
        created = self.create_application()
        application_id = created["id"]

        start_review_response = self.client.post(f"/api/applications/{application_id}/start-review")
        self.assertEqual(start_review_response.status_code, 400)

        submit_response = self.client.post(f"/api/applications/{application_id}/submit")
        self.assertEqual(submit_response.status_code, 200)

        second_submit_response = self.client.post(f"/api/applications/{application_id}/submit")
        self.assertEqual(second_submit_response.status_code, 400)

        decision_response = self.post_json(
            f"/api/applications/{application_id}/decision",
            {"decision": "Approved", "comment": ""},
        )
        self.assertEqual(decision_response.status_code, 400)
