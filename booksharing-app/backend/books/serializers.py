from rest_framework import serializers
from .models import Author, Tag, Book, PromotionalVideo


class AuthorSerializer(serializers.ModelSerializer):
  books_count = serializers.SerializerMethodField()

  class Meta:
    model = Author
    fields = ['id', 'name', 'bio', 'books_count', 'created_at']

  def get_books_count(self, obj):
    return obj.books.count()

  
class TagSerializer(serializers.ModelSerializer):
  class Meta:
    model = Tag
    fields = ['id', 'name']


class BookListSerializer(serializers.ModelSerializer):
  author_name = serializers.CharField(source='author.name',
                                      read_only=True)
  tags = TagSerializer(many=True, read_only=True)
  has_pdf = serializers.SerializerMethodField()

  class Meta:
    model = Book
    fields = ['id', 'title', 'author_name', 'tags',
              'description', 'created_at', 'has_pdf']
    
  def get_has_pdf(self, obj):
    return bool(obj.pdf_file)


class BookDetailSerializer(serializers.ModelSerializer):
  author = AuthorSerializer(read_only = True)
  tags = TagSerializer(many=True, read_only=True)
  pdf_url = serializers.SerializerMethodField()
  has_pdf = serializers.SerializerMethodField()



  class Meta:
    model = Book
    fields = ['id', 'title', 'author', 'description', 'tags',
              'isbn', 'published_date','created_at', 'updated_at',
              'pdf_file', 'pdf_url', 'has_pdf']
    
  def get_pdf_url(self, obj):
    if obj.pdf_file:
      request = self.context.get('request')
      if request:
        return request.build_absolute_uri(obj.pdf_file.url)
      return None
  
  def get_has_pdf(self, obj):
    return bool(obj.pdf_file)
    
  
class BookCreateUpdateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = ['id', 'title', 'author', 'description',
              'tags', 'isbn', 'published_date', 'pdf_file']
    
  def validate_pdf_file(self, value):
    if value:
      if value.size > 10 * 1024 * 1024:
        raise serializers.ValidationError('pdf file size exceed 10 mb')
      if not value.name.endswith('.pdf'):
        raise serializers.ValidationError('only pdf files allowed')
      return value
    
  def validate(self, data):
    # check for unique_together constraint
    title = data.get('title')
    author = data.get('author')

    if self.instance:
      if Book.objects.filter(title=title,
            author=author).exclude(pk=self.instance.pk).exists():
        raise serializers.ValidationError('A book with this \
            author already exists.')
    
    else:
      if Book.objects.filter(title=title,
          author=author).exists():
        raise serializers.ValidationError(' A book with \
            this author already exists.')
    
    return data
  

class PromotionalVideoSerializer(serializers.ModelSerializer):
  video_url = serializers.SerializerMethodField()

  class Meta:
    model = PromotionalVideo
    fields = ['id', 'title', 'description',
              'video_url', 'uploaded_at']
    
  def get_video_url(self, obj):
    request = self.context.get('request')
    if request and obj.video_file:
      return request.build_absolute_uri(obj.video_file.url)
    return None