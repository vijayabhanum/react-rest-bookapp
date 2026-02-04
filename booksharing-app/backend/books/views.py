from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Author, Tag, Book
from .serializers import (
  AuthorSerializer,
  TagSerializer,
  BookListSerializer,
  BookDetailSerializer,
  BookCreateUpdateSerializer
)



class AuthorViewSet(viewsets.ModelViewSet):
  queryset = Author.objects.all()
  serializer_class = AuthorSerializer
  filter_backends = [
    filters.SearchFilter,
    filters.OrderingFilter,
  ]
  search_fields = ['name']
  ordering_fields = ['name', 'created_at']
  ordering = ['name']


class TagViewSet(viewsets.ModelViewSet):
  queryset = Tag.objects.all()
  serializer_class = TagSerializer
  filter_backends = [filters.SearchFilter]
  search_fields = ['name']


class BookViewSet(viewsets.ModelViewSet):
  queryset = Book.objects.select_related(
      'author').prefetch_related('tags').all()
  filter_backends = [
    filters.SearchFilter,
    filters.OrderingFilter
  ]
  search_fields = ['title', 'author__name', 'description']
  ordering_fields = ['title', 'created_at', 'published_date']
  ordering = ['-created_at']

  def get_serializer_class(self):
    if self.action == 'list':
      return BookListSerializer
    elif self.action in ['create', 'update', 'partial_update']:
      return BookCreateUpdateSerializer
    return BookDetailSerializer

  @action(detail=False, methods=['get'])
  def by_tag(self, request):
    tag_name = request.query_params.get('tag', None)
    if tag_name:
      books = self.queryset.filter(tags__name__icontains = tag_name)
      serializer = BookListSerializer(books, many = True)
      return Response(serializer.data)
    return([])
  




# GET	/api/books/	list()	Get all books
# POST	/api/books/	create()	Create new book
# GET	/api/books/5/	retrieve()	Get one book
# PUT	/api/books/5/	update()	Replace entire book
# PATCH	/api/books/5/	partial_update()	Update some fields
# DELETE	/api/books/5/	destroy()	Delete book

