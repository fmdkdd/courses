from django.conf.urls import patterns, include, url
from django.contrib import admin
from django_test import views


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_test.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name="index"),
    url(r'^posts0/', views.posts0, name="posts0"),
    url(r'^posts1/', views.posts1, name="posts1"),
    url(r'^posts2/', views.posts2, name="posts2"),
    url(r'^friends/(?P<user>\w+)?', views.friends, name="friends"),
)
