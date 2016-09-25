from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=200)
    age = models.IntegerField(default=0)

    def __unicode__(self):
        return self.name
