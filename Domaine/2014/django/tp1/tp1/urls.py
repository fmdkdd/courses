from django.conf.urls import patterns, include, url
from django.contrib import admin
from myapp import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tp1.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^myapp/players$', views.index),
    url(r'^myapp/players2$', views.getPlayers),
    url(r'^myapp/players3$', views.getPlayersTable),
    url(r'^myapp/players4$', views.getPlayersTableTemplate),
    url(r'^myapp/api/players$', views.getPlayersJSON),
)
