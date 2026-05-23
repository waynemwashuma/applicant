from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja import NinjaAPI, Router
from ninja.errors import HttpError

from .models import Application, ApplicationStatus
from .schemas import (
    ApplicationCreateSchema,
    ApplicationResponseSchema,
    ApplicationUpdateSchema,
    ReviewerDecisionSchema,
)


api = NinjaAPI(title="Application Workflow Tracker API", version="1.0.0")
router = Router(tags=["applications"])


def _get_application_or_404(application_id: str) -> Application:
    return get_object_or_404(Application, id=application_id)


def _require(condition: bool, message: str, status_code: int = 400) -> None:
    if not condition:
        raise HttpError(status_code, message)


@router.get("/applications", response=list[ApplicationResponseSchema])
def list_applications(request):
    return Application.objects.all()


@router.post("/applications", response={201: ApplicationResponseSchema})
def create_application(request, payload: ApplicationCreateSchema):
    return 201, Application.objects.create(**payload.model_dump())


@router.get("/applications/{application_id}", response=ApplicationResponseSchema)
def get_application(request, application_id: str):
    return _get_application_or_404(application_id)


@router.patch("/applications/{application_id}", response=ApplicationResponseSchema)
def update_application(request, application_id: str, payload: ApplicationUpdateSchema):
    application = _get_application_or_404(application_id)
    _require(application.is_editable, "Only draft or need-more-information applications can be edited.")
    timestamp = timezone.now()

    application.applicant_name = payload.applicant_name
    application.applicant_email = payload.applicant_email
    application.company_name = payload.company_name
    application.application_type = payload.application_type
    application.description = payload.description

    if payload.resubmit:
        _require(
            application.status == ApplicationStatus.NEED_MORE_INFORMATION,
            "Only need-more-information applications can be resubmitted.",
        )
        application.status = ApplicationStatus.SUBMITTED
        application.submitted_at = timestamp

    application.save()
    return application


@router.post("/applications/{application_id}/submit", response=ApplicationResponseSchema)
def submit_application(request, application_id: str):
    application = _get_application_or_404(application_id)
    _require(application.can_submit, "Only draft applications can be submitted.")
    timestamp = timezone.now()

    application.status = ApplicationStatus.SUBMITTED
    application.submitted_at = application.submitted_at or timestamp
    application.save()
    return application


@router.post("/applications/{application_id}/start-review", response=ApplicationResponseSchema)
def start_review(request, application_id: str):
    application = _get_application_or_404(application_id)
    _require(application.can_start_review, "Only submitted applications can move to under review.")

    application.status = ApplicationStatus.UNDER_REVIEW
    application.save()
    return application


@router.post("/applications/{application_id}/decision", response=ApplicationResponseSchema)
def record_reviewer_decision(
    request,
    application_id: str,
    payload: ReviewerDecisionSchema,
):
    application = _get_application_or_404(application_id)
    _require(
        application.can_record_decision,
        "Only under review applications can receive a reviewer decision.",
    )

    comment = payload.comment.strip()
    if payload.decision in {
        ApplicationStatus.NEED_MORE_INFORMATION,
        ApplicationStatus.REJECTED,
    }:
        _require(bool(comment), "A reviewer comment is required for this decision.")

    timestamp = timezone.now()
    application.status = payload.decision
    application.reviewer_comment = comment
    application.reviewed_at = timestamp
    application.save()
    return application


api.add_router("", router)
