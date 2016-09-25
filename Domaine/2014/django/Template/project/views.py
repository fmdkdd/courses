from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from project.models import *
import html
import json

# Index page
def index(request):
    return render(request, "index.html")


# List all players in a simple way
def players(request):
    res = [x.name+"<br>" for x in Player.objects.all()]
    return HttpResponse(res)


# List all players using templates
def players2(request):
    res = [x for x in Player.objects.all()]
    return render(request, "players.html", {"players": res})


# List all matchs using templates
def matchs(request):
    res = [x for x in Match.objects.all()]
    return render(request, "matchs.html", {"matchs": res})


# List Player details
def player_details(request, player):
    res = next(x for x in Player.objects.all() if x.name == player)
    return render(request, "player_details.html", {"player": res})

def truc_form(request):
    form = TrucForm()
    print(dir(form.fields))
    form.fields['truc'].widget = forms.TextInput(attrs={'value':'kikoo'})
    return render(request, "truc_form.html", {"form": form})


# List all players (JSON)
def players_json(request):
    res = []
    for p in Player.objects.all():
        c = len(Participation.objects.filter(player=p.id))
        res += [{ "name": p.name, "age": p.age, "matchesCount": c }]
    return HttpResponse(json.dumps(res), content_type="application/json")

def players_table(request):
    filter = html.unescape(request.GET.get('filter', ''))
    res = Player.objects.filter(name__icontains=filter)
    return render(request, "players_table.html", {"players": res})
