import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Crée un superutilisateur automatiquement pour Render'

    def handle(self, *args, **kwargs):
        username = os.environ.get('INITIAL_ADMIN_USERNAME')
        email = os.environ.get('INITIAL_ADMIN_EMAIL')
        password = os.environ.get('INITIAL_ADMIN_PASSWORD')

        if username and email and password:
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(self.style.SUCCESS(f'✅ Superutilisateur "{username}" créé.'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ "{username}" existe déjà.'))
        else:
            self.stdout.write(self.style.NOTICE('ℹ️ Variables admin non détectées.'))