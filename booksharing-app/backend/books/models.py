from django.db import models

# Create your models here.
class Author(models.Model):
  name = models.CharField(max_length=200)
  bio = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.name
  
  class Meta:
    ordering = ['name']


class Tag(models.Model):
  name = models.CharField(max_length=50, unique=True)

  def __str__(self):
    return self.name
  
  class Meta:
    ordering = ['name']

class Book(models.Model):
  title = models.CharField(max_length=300)
  author = models.ForeignKey(Author, on_delete=models.CASCADE,
                             related_name='books')
  description = models.TextField(blank=True)
  tags = models.ManyToManyField(Tag, blank=True,
                                related_name='books')
  isbn = models.CharField(max_length=13, blank=True)
  published_date = models.DateField(null=True, blank=True)
  pdf_file = models.FileField(upload_to='books/pdfs/', blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title
  
  class Meta:
    ordering = ['-created_at']
    unique_together = ['title', 'author']