from django.contrib import admin
from project.models import *

class ParticipationInline(admin.TabularInline):
    model = Participation
    extra = 1

class PlayerAdmin(admin.ModelAdmin):
    inlines = (ParticipationInline,)

class MatchAdmin(admin.ModelAdmin):
    inlines = (ParticipationInline,)

# Register your models here.
admin.site.register(Player, PlayerAdmin)
admin.site.register(Match, MatchAdmin)
admin.site.register(Participation)
