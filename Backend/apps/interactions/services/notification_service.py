"""
catalog/services/notification_service.py

Business logic for creating notifications.
Called by views after key events — keeps views thin and logic testable.

Usage examples:

  from catalog.services.notification_service import NotificationService

  # After admin accepts a recommendation:
  NotificationService.reco_reviewed(recommendation)

  # After a new episode is added:
  NotificationService.new_episode(episode)
"""

from django.contrib.auth import get_user_model

from ..models.notification import Notification
from ..models.animeRecommendation import AnimeRecommendation
from ...catalog.models.episode import Episode

User = get_user_model()


class NotificationService:

    @staticmethod
    def _create(recipient, notif_type, title, message,
                related_anim=None, related_reco=None):
        """Internal helper — always use the named methods below."""
        return Notification.objects.create(
            recipient=recipient,
            notif_type=notif_type,
            title=title,
            message=message,
            related_anim=related_anim,
            related_reco=related_reco,
        )

    # ── User → Admin flow ────────────────────────────────────────────────────

    @staticmethod
    def reco_received(recommendation: AnimeRecommendation):
        """
        Notify all admin users when a user submits a recommendation.
        Called in: POST /api/recommendations/  (view or signal)
        """
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            NotificationService._create(
                recipient=admin,
                notif_type=Notification.Type.SYSTEM,
                title="New anime recommendation",
                message=(
                    f"{recommendation.user.username} recommended "
                    f'"{recommendation.title}".'
                ),
                related_reco=recommendation,
            )

    # ── Admin → User flow ────────────────────────────────────────────────────

    @staticmethod
    def reco_reviewed(recommendation: AnimeRecommendation):
        """
        Notify the user after the admin accepts or rejects their recommendation.
        Called in: PATCH /api/admin/recommendations/{id}/
        """
        accepted = recommendation.status == AnimeRecommendation.Status.ACCEPTED
        notif_type = (
            Notification.Type.RECO_ACCEPTED if accepted
            else Notification.Type.RECO_REJECTED
        )
        title = (
            f'"{recommendation.title}" has been accepted!'
            if accepted
            else f'Update on your recommendation: "{recommendation.title}"'
        )
        message = recommendation.admin_reply or (
            "Your recommendation was accepted and will be added soon."
            if accepted
            else "Your recommendation was not accepted at this time."
        )
        NotificationService._create(
            recipient=recommendation.user,
            notif_type=notif_type,
            title=title,
            message=message,
            related_reco=recommendation,
        )

    # ── Catalog events ───────────────────────────────────────────────────────

    @staticmethod
    def new_episode(episode: Episode):
        """
        Notify all users who have favorited the anime when a new episode is added.
        Called in: POST /api/admin/episodes/  (after episode is created)

        Only notifies users who haven't already seen a notification for this
        specific episode (avoids duplicates on re-saves).
        """
        from ..models.favorite import Favorite  # local import avoids circular

        anim = episode.anim
        fans = Favorite.objects.filter(anim=anim).select_related('user')

        # Skip users who already received this notification
        already_notified = set(
            Notification.objects.filter(
                notif_type=Notification.Type.NEW_EPISODE,
                related_anim=anim,
                message__contains=f"S{episode.season_number:02d}E{episode.episode_number:02d}",
            ).values_list('recipient_id', flat=True)
        )

        notifications = []
        for fav in fans:
            if fav.user_id in already_notified:
                continue
            notifications.append(Notification(
                recipient=fav.user,
                notif_type=Notification.Type.NEW_EPISODE,
                title=f"New episode — {anim.title}",
                message=(
                    f"S{episode.season_number:02d}E{episode.episode_number:02d}"
                    f"{' – ' + episode.title if episode.title else ''} is now available."
                ),
                related_anim=anim,
            ))

        # bulk_create for performance when many users have favorited the anime
        Notification.objects.bulk_create(notifications)