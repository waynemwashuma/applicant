from datetime import datetime
from uuid import UUID
from typing import Literal

from ninja import ModelSchema, Schema

from .models import Application


ApplicationTypeValue = Literal[
    "Recordation",
    "Renewal",
    "Change of Ownership",
    "Change of Name",
    "Discontinuation",
]

ApplicationStatusValue = Literal[
    "Draft",
    "Submitted",
    "Under Review",
    "Need More Information",
    "Approved",
    "Rejected",
]

ReviewerDecisionValue = Literal["Approved", "Need More Information", "Rejected"]


class ApplicationBaseSchema(Schema):
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: ApplicationTypeValue
    description: str


class ApplicationCreateSchema(ApplicationBaseSchema):
    pass


class ApplicationUpdateSchema(ApplicationBaseSchema):
    resubmit: bool = False


class ReviewerDecisionSchema(Schema):
    decision: ReviewerDecisionValue
    comment: str = ""


class ApplicationResponseSchema(ModelSchema):
    id: UUID
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: ApplicationTypeValue
    description: str
    status: ApplicationStatusValue
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None
    reviewed_at: datetime | None

    class Meta:
        model = Application
        fields = [
            "id",
            "tracking_number",
            "applicant_name",
            "applicant_email",
            "company_name",
            "application_type",
            "description",
            "status",
            "reviewer_comment",
            "created_at",
            "updated_at",
            "submitted_at",
            "reviewed_at",
        ]
