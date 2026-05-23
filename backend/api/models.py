import re
import uuid

from django.db import models, transaction


class ApplicationType(models.TextChoices):
    RECORDATION = "Recordation", "Recordation"
    RENEWAL = "Renewal", "Renewal"
    CHANGE_OF_OWNERSHIP = "Change of Ownership", "Change of Ownership"
    CHANGE_OF_NAME = "Change of Name", "Change of Name"
    DISCONTINUATION = "Discontinuation", "Discontinuation"


class ApplicationStatus(models.TextChoices):
    DRAFT = "Draft", "Draft"
    SUBMITTED = "Submitted", "Submitted"
    UNDER_REVIEW = "Under Review", "Under Review"
    NEED_MORE_INFORMATION = "Need More Information", "Need More Information"
    APPROVED = "Approved", "Approved"
    REJECTED = "Rejected", "Rejected"


TRACKING_NUMBER_PREFIX = "APP"
TRACKING_NUMBER_PATTERN = re.compile(rf"^{TRACKING_NUMBER_PREFIX}-(\d+)$")


def next_tracking_number() -> str:
    highest = 0
    for tracking_number in Application.objects.values_list("tracking_number", flat=True):
        match = TRACKING_NUMBER_PATTERN.match(tracking_number)
        if not match:
            continue
        highest = max(highest, int(match.group(1)))

    number = highest + 1
    return f"{TRACKING_NUMBER_PREFIX}-{number:04d}"


class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tracking_number = models.CharField(max_length=20, unique=True, editable=False)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)
    application_type = models.CharField(
        max_length=32,
        choices=ApplicationType.choices,
    )
    description = models.TextField()
    status = models.CharField(
        max_length=32,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT,
    )
    reviewer_comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at", "-updated_at"]

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            with transaction.atomic():
                self.tracking_number = next_tracking_number()
                super().save(*args, **kwargs)
            return

        super().save(*args, **kwargs)

    @property
    def is_editable(self) -> bool:
        return self.status in {
            ApplicationStatus.DRAFT,
            ApplicationStatus.NEED_MORE_INFORMATION,
        }

    @property
    def can_submit(self) -> bool:
        return self.status == ApplicationStatus.DRAFT

    @property
    def can_start_review(self) -> bool:
        return self.status == ApplicationStatus.SUBMITTED

    @property
    def can_record_decision(self) -> bool:
        return self.status == ApplicationStatus.UNDER_REVIEW
