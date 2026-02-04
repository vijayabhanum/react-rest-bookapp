from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, TagViewSet, BookViewSet

router = DefaultRouter()
router.register('authors', AuthorViewSet, basename='author')
router.register('tags', TagViewSet, basename='tag')
router.register('books', BookViewSet, basename='book')

urlpatterns = [
  path('', include(router.urls)),
]