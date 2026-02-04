from django.contrib import admin

# Register your models here.
from .models import Author, Book, Tag

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
  list_display = ['name', 'created_at']
  search_fields = ['name']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
  list_display = ['name']
  search_fields = ['name']

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
  list_display = ['title', 'author', 'published_date',
                  'created_at']
  list_filter = ['author', 'tags', 'created_at']
  search_fields = ['title', 'author__name']
  filter_horizontal = ['tags']
  autocomplete_fields = ['author']


  