from rest_framework import serializers
from .models import Author, Tag, Book


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

  class Meta:
    model = Book
    fields = ['id', 'title', 'author_name', 'tags',
              'description', 'created_at']


class BookDetailSerializer(serializers.ModelSerializer):
  author = AuthorSerializer(read_only = True)
  tags = TagSerializer(many=True, read_only=True)

  class Meta:
    model = Book
    fields = ['id', 'title', 'author', 'description', 'tags',
              'isbn', 'published_date','created_at', 'updated_at']
    
  
class BookCreateUpdateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = ['id', 'title', 'author', 'description',
              'tags', 'isbn', 'published_date']
    
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