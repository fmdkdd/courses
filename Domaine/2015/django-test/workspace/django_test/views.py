from django.http import HttpResponse
from django_test.models import *
from django.shortcuts import render
import json

def index(req):
    posts = load_post()
    res = " ".join(str(p) for p in posts)
    return HttpResponse(res)


def posts0(req):
    header = (
"""
==================
= All Posts      =
==================

    """)
    body = ""
    for each in load_post():
        body += (
"""
* %s
** Author
%s
** Content
%s

""")    % (each.title, each.user.name, each.content)
    return HttpResponse(header+body, content_type='text/plain')

def posts1(req):
    posts = load_post()
    return render(
        req,
        "posts1.html",
        {"posts" : posts},
        content_type='text/plain'
    )


def posts2(req):
    posts = load_post()
    return render(req, "posts2.html", {"posts" : posts, "users" : load_users()})


def friends(req, user):
    if user is None:
        users =  load_users()
    else:
        users = [u for u in load_users() if user in u.name]

    return render(req, "fragments/users.html", {"users" : users})
