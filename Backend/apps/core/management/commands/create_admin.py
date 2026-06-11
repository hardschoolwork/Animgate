import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Crée un superutilisateur si les variables d\'env sont définies'

    def handle(self, *args, **kwargs):
        admin_user = os.environ.get('INITIAL_ADMIN_USERNAME')
        admin_email = os.environ.get('INITIAL_ADMIN_EMAIL')
        admin_pass = os.environ.get('INITIAL_ADMIN_PASSWORD')

        if admin_user and admin_email and admin_pass:
            if not User.objects.filter(username=admin_user).exists():
                User.objects.create_superuser(
                    username=admin_user,
                    email=admin_email,
                    password=admin_pass
                )
                self.stdout.write(self.style.SUCCESS(f'✅ Superutilisateur "{admin_user}" créé avec succès.'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ L\'utilisateur "{admin_user}" existe déjà.'))
        else:
            self.stdout.write(self.style.NOTICE('ℹ️ Variables d\'environnement pour l\'admin initial non détectées.'))