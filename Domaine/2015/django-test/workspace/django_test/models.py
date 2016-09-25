
from django.db import models

class User(object):
    def __init__(self, name):
        self.name = name
        self.post = []

    
class Post(object):
    age = models.CharField(max_length=200)
    def __init__(self, id, user, content, title):
        self.id = id
        self.user = user
        self.comments = []
        self.content = content
        self.title = title
        
    def __str__(self):
        return "post@%s\n" % (id(self))

class Comment(object):
    def __init__(self, id, user, post, content):
        self.id = id
        self.user = user
        self.post = post
        self.content = content

lorem = "Sed cautela nimia in"

users = []
posts = []
comments = []
for i in range(0, 3):
    user = User("user_%i" % (i))
    for j in range(0, 2):
        post = Post(len(posts), user, "posts_%i" % (j), "Title_%i " % (j))
        for k in range(0, 2):
            comment = Comment(len(comments), user, post, "comment_%i" % (k))
            comments += [comment]
            post.comments.append(comment)
        posts += [post]
    users += [user]
        
def load_users():
    return users

def load_post():
    return posts