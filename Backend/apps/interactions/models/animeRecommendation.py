from django.conf import settings
from django.db import models


class AnimeRecommendation(models.Model):
    """
    A user suggests an anime to the admin via the "Recommend" button.

    Flow:
      1. User fills the modal → POST /api/recommendations/
      2. A Notification is automatically created for every admin user
         (handled in the view or via a signal in services/).
      3. Admin opens notifications → sees the recommendation → replies.
      4. A Notification is sent back to the user with the admin reply.
    """

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recommendations'
    )
    title = models.CharField(max_length=255)
    note = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    admin_reply = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # needed to know when admin last updated the status/reply
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_status_display()}] {self.user} → {self.title}"