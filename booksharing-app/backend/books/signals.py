from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Book
import os

@receiver(post_delete, sender=Book)
def delete_book_pdf_on_delete(sender, instance, **kwargs):
  if instance.pdf_file:
    if os.path.isfile(instance.pdf_file.path):
      os.remove(instance.pdf_file.path)
    
@receiver(pre_save, sender=Book)
def delete_old_pdf_on_update(sender, instance, **kwargs):
  if not instance.pk:
    return
  
  try:
    old_file = Book.objects.get(pk=instance.pk).pdf_file
  except Book.DoesNotExist:
    return
  
  new_file = instance.pdf_file
  if old_file and old_file != new_file:
    if os.path.isfile(old_file.path):
      os.remove(old_file.path)