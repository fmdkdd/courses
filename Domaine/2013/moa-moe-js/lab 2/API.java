package controllers;

import play.*;
import play.mvc.*;

import java.text.SimpleDateFormat;
import java.util.*;

import models.*;

public class API extends Controller {

    public static void events() {
        List<Event> events = Event.findAll();
        renderJSON(events);
    }

}
