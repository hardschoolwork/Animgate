"""
Django settings for config project.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url  # ✅ AJOUTÉ

load_dotenv()
load_dotenv(override=True)

BASE_DIR = Path(__file__).resolve().parent.parent

AUTH_USER_MODEL = 'users.User'

# ============================================================
# 1. SÉCURITÉ (Adapté pour Render)
# ============================================================
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-rd3#8mp8@o%xd7iesh9_teaiy%++5^7us*t(qat7%a(f)c1gq8')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ============================================================
# 2. APPLICATIONS
# ============================================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',

    'apps.api',
    'apps.catalog',
    'apps.suggestions',
    'apps.interactions',
    'apps.library',
    'apps.users',
]

# ============================================================
# 3. MIDDLEWARE (CORRIGÉ : plus de doublons + WhiteNoise)
# ============================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ============================================================
# 4. REST FRAMEWORK & CORS
# ============================================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:4200'
).split(',')

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ============================================================
# 5. BASE DE DONNÉES (PostgreSQL sur Render, SQLite en local)
# ============================================================
if os.environ.get('DATABASE_URL'):
    # ✅ PRODUCTION : PostgreSQL via Render
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    # ✅ LOCAL : SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# ============================================================
# 6. STOCKAGE MÉDIAS (R2 Cloudflare - INTACT)
# ============================================================
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": {
            "bucket_name": os.getenv("R2_BUCKET_NAME"),
            "access_key": os.getenv("R2_ACCESS_KEY"),
            "secret_key": os.getenv("R2_SECRET_KEY"),
            "endpoint_url": os.getenv("R2_ENDPOINT_URL"),
            "region_name": "auto",
            "default_acl": "public-read",
            "querystring_auth": False,
            "file_overwrite": False,
            "custom_domain": os.getenv("R2_PUBLIC_URL", "").replace("https://", ""),
        },
    },
    "staticfiles": {
        # ✅ AJOUTÉ : WhiteNoise pour les fichiers statiques en prod
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage" if os.environ.get('DATABASE_URL') else "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

AWS_S3_SIGNATURE_VERSION = 's3v4'
MEDIA_URL = f"{os.getenv('R2_PUBLIC_URL', '')}/"
AWS_S3_OBJECT_PARAMETERS = {
    "CacheControl": "public, max-age=31536000",
}
MEDIA_ROOT = BASE_DIR / 'media'

# ============================================================
# 7. FICHIERS STATIQUES (CSS/JS de l'admin Django)
# ============================================================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # ✅ AJOUTÉ pour collectstatic

# ============================================================
# 8. VALIDATION DES MOTS DE PASSE
# ============================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================================================
# 9. INTERNATIONALISATION
# ============================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'