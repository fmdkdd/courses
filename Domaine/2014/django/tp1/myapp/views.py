from django.shortcuts import render
from django.http import HttpResponse
from myapp.models import Player
from django.shortcuts import render
from django.core import serializers
import json

# Create your views here.
def index(request):
    pl = Player.objects.all()
    return render(request, "index.html", {"players":pl})

def getPlayers(request):
    p = Player.objects.all()
    pl = [ x.name+"<br>" for x in p]
    return HttpResponse(pl)

def getPlayersJSON(request):
    p = Player.objects.all()
    pl = [ {"name": x.name, "age": x.age} for x in p]
    r = HttpResponse(json.dumps(pl), content_type="application/json")
    #r['Access-Control-Allow-Origin'] = "*"
    return r

def getPlayersTable(request):
    p = Player.objects.all()
    pl = [ "<tr><td>"+x.name+"</td></tr>" for x in p]

    res = "<table border=1 style='color:red'><thead><tr><th>Name</th></tr></thead>"+\
          "<tbody>"+\
          "".join(pl)+\
          "</tbody></table>"
    return HttpResponse(res)

def getPlayersTableTemplate(request):
    pl = Player.objects.all()
    return render(request, "players.html", {"players":pl})
