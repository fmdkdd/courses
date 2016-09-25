from django.conf.urls import patterns, include, url
from django.contrib import admin
from project import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Proto.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name="index"),
    url(r'^project/$', views.index, name="index"),
    url(r'^project/players_text/$', views.players, name="players"),
    url(r'^project/players/$', views.players2, name="players2"),
    url(r'^project/matchs/$', views.matchs, name="matchs"),
    url(r'^project/api/players/$', views.players_json, name="players_json"),
    url(r'^project/player_details/(?P<player>\w+)/$', views.player_details, name="playerDetails"),
    url(r'^project/api2/players/$', views.players_table, name="players_table"),
    url(r'^project/trucform/$', views.truc_form),
)
