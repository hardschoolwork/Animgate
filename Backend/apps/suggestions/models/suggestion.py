from django.db import models
from apps.users.models import User

class Suggestion(models.Model):

    STATE_CHOICES = [
        ("pending", "En attente"),
        ("accepted", "Validée"),
        ("rejected", "Rejetée"),
    ]

    suggested_anim =models.CharField(max_length=50)
    message = models.TextField()
    state = models.CharField(max_length=20,choices=STATE_CHOICES,default="pending")

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username + " - " + self.suggested_anim

