from django.shortcuts import render
from django.http import FileResponse, Http404
import os

# Create your views here.
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Author, Tag, Book, PromotionalVideo
from .serializers import (
  AuthorSerializer,
  TagSerializer,
  BookListSerializer,
  BookDetailSerializer,
  BookCreateUpdateSerializer, 
  PromotionalVideoSerializer
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
  parser_classes = (MultiPartParser, FormParser)
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
  
  @action(detail=True, methods=['get'])
  def download_pdf(self, request, pk=None):
    book = self.get_object()

    #  # Option 2: Use pk directly
    # book = Book.objects.get(pk=pk)
    
    # # Option 3: Use self.kwargs
    # book = Book.objects.get(pk=self.kwargs['pk'])
    # we can use other options too as pk=None means jsut saying 
    # python that its an optional param, while here its passed as 
    # kwargs['pk'] decoded from url , well the viewset does that 
    # for you.... but get_object() living it emptry gives 
    # itself power to handle errors, permissions and filters
    

    if not book.pdf_file:
      return Response({'error':'No pdf file'},
                      status=status.HTTP_404_NOT_FOUND)

    try:
      file_path = book.pdf_file.path
      if os.path.exists(file_path):
        response = FileResponse(
            open(file_path, 'rb'),
            content_type='application/pdf'
          )
        filename = f"{book.title.replace(' ', '-')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
      else: 
        return Response({'error':'file not found'},
                        status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
      return Response({'error': str(e)},
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
  @action(detail=True, methods=['delete'])
  def delete_pdf(self, request, pk=None):
    book = self.get_object()

    if not book.pdf_file:
      return Response(
        {'error': 'No pdf'}, status=status.HTTP_404_NOT_FOUND
      )
    
    book.pdf_file.delete()
    book.save()

    return Response(
      {'messgae':'pdf deleted succesfully'},
      status=status.HTTP_200_OK
    )


# GET	/api/books/	list()	Get all books
# POST	/api/books/	create()	Create new book
# GET	/api/books/5/	retrieve()	Get one book
# PUT	/api/books/5/	update()	Replace entire book
# PATCH	/api/books/5/	partial_update()	Update some fields
# DELETE	/api/books/5/	destroy()	Delete book

class PromotionalVideoViewSet(viewsets.ReadOnlyModelViewSet):
  serializer_class = PromotionalVideoSerializer

  def get_queryset(self):
    return PromotionalVideo.objects.filter(is_active=True)